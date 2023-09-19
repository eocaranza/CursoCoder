import { CartsService } from "../services/carts.services.js";

export class CartsController{

    static async getCarts(req, res){
        const limit = req.query.limit;
        const recibidos = await CartsService.getCarts();
        if(limit)
        {
            const filtrados = recibidos.splice(0,limit);
            res.json({status: "success", data: filtrados});
        }
        else
            res.json({status: "success", data: recibidos});
    }

    static async getCartById(req, res){
        const cartId = req.params.cid;
        const recibido = await CartsService.getCartById(cartId);
        //const cart = recibidos.find(carrito => carrito.id === cartId);
        if(!recibido){
            res.status(404).json({status: "error", message: "El carrito no existe"});
        }
        else
            res.json({status: "success", data: recibido});
    }

    static async addCart(req, res){
        const recibido = await CartsService.addCart(req.body);
        if(recibido._id)
            res.json({status: "success", message: recibido});
        else
            res.json({status: "error", message: recibido});
    }

    static async addProduct(req, res){
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const recibido = await CartsService.addProduct(cartId,prodId);
        if(recibido === true)
            res.json({status: "success", message: "Producto agregado"});
        else
            res.json({status: "error", message: recibido});
    }

    static async deleteProduct(req, res){
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const recibido = await CartsService.deleteProduct(cartId,prodId);
        if(recibido === true)
            res.json({status: "success", message: "Producto elminado"});
        else
            res.json({status: "error", message: recibido});
    }

    static async deleteProducts(req, res){
        const cartId = req.params.cid;
        const recibido = await CartsService.deleteProducts(cartId);
        if(recibido === true)
            res.json({status: "success", message: "Productos elminados"});
        else
            res.json({status: "error", message: recibido});
    }

    static async editCart(req, res){
        const cartId = req.params.cid;
        const recibido = await CartsService.editCart(cartId, req.body);
        if(recibido)
            res.json({status: "success", message: "Carrito actualizado"});
        else
            res.json({status: "error", message: recibido});
    }

    static async editQuantity(req, res){
        const cartId = req.params.cid;
        const prodId = req.params.pid;
        const recibido = await CartsService.editQuantity(cartId, prodId, req.body);
        if(recibido)
            res.json({status: "success", message: "Carrito actualizado"});
        else
            res.json({status: "error", message: recibido});
    }
}