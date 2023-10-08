import {Router} from "express";
import { ProductsController } from "../controllers/products.controller.js";
import { checkRole } from "../middlewares/auth.js";

const prodManager = ProductsController;
const router = Router();


//definimos las rutas
router.get("/", prodManager.getProducts);

router.get("/:pid", prodManager.getProductById);

router.post("/", /*checkRole("admin"),*/ prodManager.addProduct);

router.put("/:pid", checkRole("admin"), prodManager.updateProduct);

router.delete("/:pid", checkRole("admin"), prodManager.deleteProduct);

export {router as productsRouter}