import { cartsModel } from "../../models/carts.model.js";
import { productsModel } from "../../models/products.model.js";
import { productsCollection } from "../../../constants/index.js";
import mongoose from "mongoose";

export class CartsMongo{
    constructor(){
        this.model = cartsModel;
        this.productModel = productsModel;
    };

    //get carts
    async getCarts(){
        try{
            const carts = await this.model.find().populate('products._id');
            return carts;
        }catch(error){
            console.log(error.message);
            throw new Error("Error al obtener los carritos");
        }
    }

    //save cart
    async addCart(cartInfo){
        try{
            if(!cartInfo.products)
                return "Debe crearse con productos";
            cartInfo.products.forEach(async prod =>{
                const encontrado = await this.productModel.findById(prod._id);
                if(!encontrado)
                    throw new Error("Uno de los productos no existe"); 
            });
            const cart = await this.model.create(cartInfo);
            return cart;
        }catch(error){
            return error.message;
        }
    }

    //get cart by id
    async getCartById(id){
        try{
            const cart = await this.model.findById(id).populate('products.product');
            return cart;
        }catch(error){
            console.log(error.message);
            throw new Error("Error al obtener el carrito");
        }
    }

    //add product to cart
    async addProduct(idCarrito, idProducto){
        try{
            const cart = await this.model.findById(idCarrito);
            if(!cart)
                return "No existe el carrito"
            const product = await this.productModel.findById(idProducto);
            if(!product)
                return "No existe el producto"

            // Buscar si el producto ya está en el carrito
            const existingProduct = cart.products.find(prod => prod.product === idProducto);
            
            if (existingProduct) {
                existingProduct.quantity++; // Incrementar la cantidad
            } else {
                cart.products.push({ product: idProducto, quantity: 1 }); // Agregar el producto con cantidad 1
            }

            // Guardar el carrito actualizado
            cart.save();
            return true;
        }catch(error){
            return error.message;
        }
    }

    //borrar producto del carrito
    async deleteProduct(idCarrito, idProducto){
        try{
            const cart = await this.model.findById(idCarrito);
            if(!cart)
                return "No existe el carrito"
            const product = await this.productModel.findById(idProducto);
            if(!product)
                return "No existe el producto"

            // quitar el producto en el carrito
            const index = cart.products.findIndex((prod) => prod._id.toString() == idProducto);
            cart.products.splice(index,1);
            // Guardar el carrito actualizado
            cart.save();
            return true;
        }catch(error){
            return error.message;
        }
    }

    //borrar todos los productos del carrito
    async deleteProducts(idCarrito){
        try{
            const cart = await this.model.findById(idCarrito);
            if(!cart)
                return "No existe el carrito"

            // quitar productos del carrito
            cart.products.splice(0,cart.products.length);
            // Guardar el carrito actualizado
            cart.save();
            return true;
        }catch(error){
            return error.message;
        }
    }

    //add products to cart
    async editCart(idCarrito, prodInfo){
        try{
            const cart = await this.model.findById(idCarrito);
            if(!cart)
                return "No existe el carrito"

            cart.products.splice(0,cart.products.length);

            prodInfo.forEach(prod =>{
                cart.products.push(prod);
            });
            // Guardar el carrito actualizado
            cart.save();
            return true;
        }catch(error){
            return error.message;
        }
    }

    //modificar producto del carrito
    async editQuantity(idCarrito, idProducto, prodInfo){
        try{
            const cart = await this.model.findById(idCarrito);
            if(!cart)
                return "No existe el carrito"
            const product = await this.productModel.findById(idProducto);
            if(!product)
                return "No existe el producto"

            // quitar el producto en el carrito
            const index = cart.products.findIndex((prod) => prod._id.toString() == idProducto);
            cart.products[index].quantity = prodInfo.quantity;
            // Guardar el carrito actualizado
            cart.save();
            return true;
        }catch(error){
            return error.message;
        }
    }
}