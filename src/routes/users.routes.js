import { Router } from "express";
import { checkRole } from "../middlewares/auth.js";
import { UsersController } from "../controllers/users.controller.js";
import { uploader } from "../utils.js";

const router = Router();

router.post("/premium/:uid", checkRole(["admin"]), UsersController.modifyRole);

router.post("/:uid/documents"/*, uploader.single("document")*/, UsersController.uploadFiles);

export {router as usersRouter};