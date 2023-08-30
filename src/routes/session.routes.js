import { Router, application } from "express";
import { userService } from "../dao/index.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";

const router = Router();

router.post("/login", async (req,res)=>{
    try {
        const loginInfo = req.body;
        const rol = (loginInfo.email == "adminCoder@coder.com")?
        "Administrador" : "Usuario";
        const user = await userService.getUserByEmail(loginInfo.email);
        if(!user && rol == "Usuario")
            return res.render("login",{error: "El usuario no se registró"});

        if(isValidPassword(user, loginInfo.password) || (loginInfo.password == "adminCod3r123" && rol == "Administrador")){
            req.session.userInfo = {
                first_name: user?.first_name ? user.first_name : "AdminCoder",
                email: user?.email ? user.email : loginInfo.email,
                role: rol
            }
            res.redirect("/products");
        }
        else
            res.render("login", {error:"Credenciales invalidas"});
    } catch (error) {
        res.render("login",{error: error.message});
    }
});

router.post("/signup", async (req,res)=>{
    try {
        const signupInfo = req.body;
        const user = await userService.getUserByEmail(signupInfo.email);
        if(user)
            return res.render("signup",{error: "El usuario ya se registró"});
        const newUser = {
            first_name: signupInfo.first_name,
            last_name: signupInfo.last_name,
            age: signupInfo.age,
            email: signupInfo.email,
            password: createHash(signupInfo.password)
        }
        await userService.save(newUser);
        res.render("login", {message:"Usuario registrado"});
    } catch (error) {
        res.render("signup",{error: error.message});
    }
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

export {router as sessionRouter};