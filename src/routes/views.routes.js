import { Router } from "express";
import { checkRole, checkUserAuthenticated, showLoginView } from "../middlewares/auth.js";
import { ViewsController } from "../controllers/views.controller.js";

const router = Router();

router.get("/", checkUserAuthenticated, checkRole("user"), ViewsController.renderHome);

router.get("/registro", showLoginView, ViewsController.renderSignup);

router.get("/login", showLoginView, ViewsController.renderLogin);

router.get("/carts/:cid", ViewsController.renderCartById);

router.get("/products", checkUserAuthenticated, ViewsController.renderProducts);

router.get("/products/:pid", checkUserAuthenticated, ViewsController.renderProductById);

export {router as viewsRouter};