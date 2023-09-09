import { Router, application } from "express";
import { userService } from "../dao/index.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import { checkUserAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/signup", passport.authenticate("signupStrategy",{
    failureRedirect: "/api/sessions/fail-signup"
}), (req, res) => {
    res.redirect("/products");
});

router.get("/fail-signup", (req,res)=>{
    res.render("signup", {error: "No se pudo registrar el usuario"})
});

router.post("/login", passport.authenticate("loginStrategy",{
    failureRedirect: "/api/sessions/fail-login"
}), (req, res) => {
    res.redirect("/products");
});

router.get("/fail-login", (req,res)=>{
    res.render("login", {error: "Error al iniciar sesion"})
});

router.get("/logout", async (req,res)=>{
    req.session.destroy(error => {
        if(error) return res.redirect("/products");
        else return res.redirect("/");
    });
});

router.get("/loginGitHub", passport.authenticate("githubLoginStrategy"));

router.get("/github-callback", passport.authenticate("githubLoginStrategy",{
    failureRedirect: "/api/sessions/signup"
}), (req, res) => {
    res.redirect("/products");
});

router.get("/current", async (req,res)=>{
    if(req.user)
            res.render("current", {user: req.user.toJSON()});
        else
            res.render("current", {error: "No se encuentra loggeado"});
});

export {router as sessionRouter};