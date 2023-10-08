import { ProductsService } from "../services/products.services.js";
import { ProductDto } from "../dao/dto/product.dto.js";
import { CustomError } from "../services/error/customError.services.js";
import { createProductErrorMsg } from "../services/error/createProductError.services.js";
import { EError } from "../enums/EError.js";

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
            const {name, price, stock} = req.body;
            //console.log(name + price + stock);
            if(!name || !price || !stock){
                CustomError.createError({
                    name: "error addProduct",
                    cause: createProductErrorMsg(req.body),
                    message: "Error en los campos de producto",
                    errorCode: EError.INVALID_JSON
                });
            }
            else{
            const dtoInfo = new ProductDto(req.body);
            const recibidos = await ProductsService.addProduct(dtoInfo);
            if(recibidos === true)
                res.json({status: "success", message: "Producto agregado"});
            else
                CustomError.createError({
                    name: "error addProduct",
                    cause: createProductErrorMsg(req.body),
                    message: "Error al crear producto",
                    errorCode: EError.DATABASE_ERROR
                });
            }
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
            CustomError.createError({
                name: "error updateProduct",
                cause: createProductErrorMsg(req.body),
                message: "Error al actualizar producto",
                errorCode: EError.DATABASE_ERROR
            });
        }
    }

    static async deleteProduct(req, res){
        const productId = req.params.pid;
        const recibidos = await ProductsService.deleteProduct(productId);
        if(recibidos === true)
            res.json({status: "success", message: "Producto eliminado"});
        else
        CustomError.createError({
            name: "error deleteProduct",
            cause: createProductErrorMsg(req.body),
            message: "Error al borrar producto",
            errorCode: EError.DATABASE_ERROR
        });
    }
}