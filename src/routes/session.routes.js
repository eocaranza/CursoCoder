import { Router, application } from "express";
import { userService } from "../dao/index.js";

const router = Router();

router.post("/login", async (req,res)=>{
    try {
        const loginInfo = req.body;
        const user = await userService.getUserByEmail(loginInfo.email);
        if(!user)
            return res.render("login",{error: "El usuario no se registró"});

        if(user.password == loginInfo.password){
            req.session.userInfo = {
                first_name: user.first_name,
                email: user.email
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
        await userService.save(signupInfo);
        res.render("login", {message:"Usuario registrado"});
    } catch (error) {
        res.render("signup",{error: error.message});
    }
});

router.post("/logout", async (req,res)=>{
    const loginInfo = req.body;
    req.session.email = loginInfo.email;
    console.log(req.session);
    res.send("Login exitoso");
});

export {router as sessionRouter};