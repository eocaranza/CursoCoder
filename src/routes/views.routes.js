import { Router } from "express";
import {productService} from '../dao/index.js'

const router = Router();

router.get("/", async (req,res) => {
    res.render("home");
});

router.get("/products", async (req,res) => {
    try {
        //capturar valores de queries
        const {limit=10, page=1, stock, sort="asc"} = req.query;

        const stockValue = stock === 0? undefined : parseInt(stock);

        const sortValue = sort === "asc"? 1:-1;
        if(!["asc","desc"].includes(sort))
            return res.render("products",{error: "Orden no valido"});

        let query = {}
        if(stockValue){
            query = {stock: {$gte:stockValue}};
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
        res.render("products", required);
    } catch (error) {
        console.log(error);
        res.render("products",{error: "Error al cargar la vista"});
    }
});

export {router as viewsRouter};