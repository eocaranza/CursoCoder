import { ProductsService } from "../services/products.services.js";
import { ProductDto } from "../dao/dto/product.dto.js";

export class ProductsController{
    static async getProducts(req, res){
        const limit = req.query.limit;
        const recibidos = await ProductsService.getProducts();
        
        if(limit)
        {
            const filtrados = recibidos.splice(0,limit);
            res.json({status: "success", data: filtrados, user : req.session.userInfo});
        }
        else
            res.json({status: "success", data: recibidos, user : req.session.userInfo});
    }

    static async getProductById(req, res){
        const productId = req.params.pid;
        const recibido = await ProductsService.getProductById(productId);
        if(!recibido){
            res.status(404).json({status: "error", message: "El producto no existe"});
        }
        else
            res.json({status: "success", data: recibido});
    }

    static async addProduct(req, res){
        {
            const dtoInfo = new ProductDto(req.body);
            const recibidos = await ProductsService.addProduct(dtoInfo);
            if(recibidos === true)
                res.json({status: "success", message: "Producto agregado"});
            else
                res.json({status: "error", message: recibidos});
        }
    }

    static async updateProduct(req, res){
        {
            const productId = req.params.pid;
            const dtoInfo = new ProductDto(req.body);
            const recibidos = await ProductsService.updateProduct(productId,dtoInfo);
            if(recibidos === true)
                res.json({status: "success", message: "Producto modificado"});
            else
                res.json({status: "error", message: recibidos});
        }
    }

    static async deleteProduct(req, res){
        const productId = req.params.pid;
        const recibidos = await ProductsService.deleteProduct(productId);
        if(recibidos === true)
            res.json({status: "success", message: "Producto eliminado"});
        else
            res.json({status: "error", message: recibidos});
    }
}