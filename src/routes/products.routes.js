import {Router} from "express";
import {productService} from '../dao/index.js'

const prodManager = productService;
const router = Router();


//definimos las rutas

router.get("/",async (req,res)=>{
    const limit = req.query.limit;
    const recibidos = await prodManager.getProducts();
    if(limit)
    {
        const filtrados = recibidos.splice(0,limit);
        res.json({status: "success", data: filtrados});
    }
    else
        res.json({status: "success", data: recibidos});
});

router.get("/:pid",async (req,res)=>{
    const productId = req.params.pid;
    const recibido = await prodManager.getProductById(productId);
    if(!recibido){
        res.status(404).json({status: "error", message: "El producto no existe"});
    }
    else
        res.json({status: "success", data: recibido});
});

router.post("/",async (req,res)=>{
    const recibidos = await prodManager.addProduct(req.body);
    if(recibidos === true)
        res.json({status: "success", message: "Producto agregado"});
    else
        res.json({status: "error", message: recibidos});
});

router.put("/:pid",async (req,res)=>{
    const productId = req.params.pid;
    const recibidos = await prodManager.updateProduct(productId,req.body);
    if(recibidos === true)
        res.json({status: "success", message: "Producto modificado"});
    else
        res.json({status: "error", message: recibidos});
});

router.delete("/:pid",async (req,res)=>{
    const productId = req.params.pid;
    const recibidos = await prodManager.deleteProduct(productId);
    if(recibidos === true)
        res.json({status: "success", message: "Producto eliminado"});
    else
        res.json({status: "error", message: recibidos});
});

export {router as productsRouter}