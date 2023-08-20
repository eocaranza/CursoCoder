import { Router, application } from "express";

const router = Router();

router.post("/login",(req,res)=>{
    const loginInfo = req.body;
    req.session.email = loginInfo.email;
    console.log(req.session);
    res.send("Login exitoso");
});

export {router as loginRouter};