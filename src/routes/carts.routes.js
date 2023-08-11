import {Router} from "express";
import { cartService } from "../dao/index.js";

const cartManager = cartService;

const router = Router();

//definimos las rutas

router.get("/",async (req,res)=>{
    const limit = req.query.limit;
    const recibidos = await cartManager.getCarts();
    if(limit)
    {
        const filtrados = recibidos.splice(0,limit);
        res.json({status: "success", data: filtrados});
    }
    else
        res.json({status: "success", data: recibidos});
});

router.get("/:cid",async (req,res)=>{
    const cartId = req.params.cid;
    const recibido = await cartManager.getCartById(cartId);
    //const cart = recibidos.find(carrito => carrito.id === cartId);
    if(!recibido){
        res.status(404).json({status: "error", message: "El carrito no existe"});
    }
    else
        res.json({status: "success", data: recibido});
});

router.post("/",async (req,res)=>{
    const recibido = await cartManager.addCart(req.body);
    if(recibido === true)
        res.json({status: "success", message: "Carrito agregado"});
    else
        res.json({status: "error", message: recibido});
});

router.post("/:cid/product/:pid",async (req,res)=>{
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    const recibido = await cartManager.addProduct(cartId,prodId);
    if(recibido === true)
        res.json({status: "success", message: "Producto agregado"});
    else
        res.json({status: "error", message: recibido});
});

export {router as cartsRouter}