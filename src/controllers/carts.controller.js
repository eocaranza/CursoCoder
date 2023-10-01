import { CartsService } from "../services/carts.services.js";
import { ProductsService } from "../services/products.services.js";
import { TicketsService } from "../services/tickets.service.js";
import { CartDto } from "../dao/dto/cart.dto.js";
import { TicketDto } from "../dao/dto/ticket.dto.js";
import {v4 as uuidv4} from 'uuid';

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
        const dtoInfo = new CartDto(req.body);
        const recibido = await CartsService.addCart(dtoInfo);
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
        const dtoInfo = new CartDto(req.body);
        const recibido = await CartsService.editCart(cartId, dtoInfo);
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

    static async getTickets(req, res){
        const recibidos = await TicketsService.getTickets();
        res.json({status: "success", data: recibidos});
    }

    static async purchase(req, res){
        const cartId = req.params.cid;
        const recibido = await CartsService.getCartById(cartId);
        if(recibido){
            const dtoInfo = new TicketDto(req.body);
            let suma = 0;
            let prodId;
            let producto;
            await recibido.products.forEach(async entrada=>{
                prodId = entrada.product._id;
                producto = await ProductsService.getProductById(prodId);
                console.log(`${producto.stock} ${entrada.quantity}`);
                if(producto.stock >= entrada.quantity){
                    suma = suma + 1;
                }
            });

            const currentDate = new Date();

            const nuevoTicket = await TicketsService.addTicket({
                code: uuidv4(),
                purchase_datetime: currentDate.getDate() + "/" + (currentDate.getMonth()+1)  + "/" + currentDate.getFullYear(),
                amount: suma,
                purchaser: "email@email.com" //req.user.email
            });

            res.json({status: "success", message: "Compra realizada"});
            console.log(nuevoTicket);
        }
        else
            res.json({status: "error", message: "No existe el carrito"});
    }
}