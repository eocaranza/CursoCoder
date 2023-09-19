import { Router } from "express";
import { checkUserAuthenticated, showLoginView } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();

router.get("/", checkUserAuthenticated, ViewsController.renderHome);

router.get("/registro", showLoginView, ViewsController.renderSignup);

router.get("/login", showLoginView, ViewsController.renderLogin);

router.get("/carts/:cid", ViewsController.renderCartById);

router.get("/products/:pid", ViewsController.renderProductById);

router.get("/products", checkUserAuthenticated, ViewsController.renderProducts);

export {router as viewsRouter};