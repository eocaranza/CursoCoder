import { Router } from "express";
import { checkUserAuthenticated, showLoginView } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();

router.get("/", checkUserAuthenticated, ViewsController.renderHome);

router.get("/registro", showLoginView, ViewsController.renderSignup);

router.get("/login", showLoginView, ViewsController.renderLogin);

router.get("/carts/:cid", ViewsController.renderCartById);

router.get("/products", checkUserAuthenticated, async (req,res) => {
    try {
        //capturar valores de queries
        const {limit=10, page=1, stock, sort="asc", name, price, category} = req.query;

        const stockValue = stock === 0? undefined : parseInt(stock);
        const nameValue = name === ""? undefined : name;
        const priceValue = price === 0? undefined : parseFloat(price);
        const categoryValue = category === 0? undefined : category;

        const sortValue = sort === "asc"? 1:-1;
        if(!["asc","desc"].includes(sort))
            return res.render("products",{error: "Orden no valido"});

        let query = {}
        if(stockValue){
            query.stock = {$gte:stockValue};
        }
        if(nameValue){
            query.name= {$eq:nameValue};
        }
        if(price){
            query.price= {$gte:priceValue};
        }
        if(category){
            query.category= {$eq:categoryValue};
        }

        const result = await productService.getProductsWithPaginate(query,
        {
            page,
            limit,
            sort: {price:sortValue},
            lean: true
        });

        //http://localhost:8080/products
        let baseUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
        let linkAux = baseUrl.includes("?") ? "&" : "?";
        let pLink;
        if(baseUrl.includes("page"))
            pLink = result.hasPrevPage ? `${baseUrl.replace(`page=${result.page}`,`page=${result.prevPage}`)}` : null;
        else
            pLink = baseUrl + `${linkAux}page=${result.prevPage}`;
        let nLink;
        if(baseUrl.includes("page"))
            nLink = result.hasNextPage ? `${baseUrl.replace(`page=${result.page}`,`page=${result.nextPage}`)}` : null;
        else
            nLink = baseUrl + `${linkAux}page=${result.nextPage}`;

        const required = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `${pLink}` : null,
            nextLink: result.hasNextPage ? `${nLink}` : null
        };
        if(req.session?.userInfo)
            res.render("products", {required: required, user: req.session.userInfo});
        else
            res.render("products", {required: required, user: req.user});
    } catch (error) {
        console.log(error);
        res.render("products",{error: "Error al cargar la vista"});
    }
});

export {router as viewsRouter};