import {Router} from "express";
import { ProductsController } from "../controllers/products.controller.js";

const prodManager = ProductsController;
const router = Router();


//definimos las rutas
router.get("/", prodManager.getProducts);

router.get("/:pid", prodManager.getProductById);

router.post("/", prodManager.addProduct);

router.put("/:pid", prodManager.updateProduct);

router.delete("/:pid", prodManager.deleteProduct);

export {router as productsRouter}