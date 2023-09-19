import {Router} from "express";
import { CartsController } from "../controllers/carts.controller.js";

const cartManager = CartsController;

const router = Router();

//definimos las rutas

router.get("/", cartManager.getCarts);

router.get("/:cid", cartManager.getCartById);

router.post("/", cartManager.addCart);

router.post("/:cid/product/:pid", cartManager.addProduct);

router.delete("/:cid/product/:pid", cartManager.deleteProduct);

router.delete("/:cid/", cartManager.deleteProducts);

router.put("/:cid/", cartManager.editCart);

router.put("/:cid/product/:pid", cartManager.editQuantity);

export {router as cartsRouter}