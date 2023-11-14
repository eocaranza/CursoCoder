import mongoose from "mongoose";
import chai from "chai";
import { CartsMongo } from "../src/dao/managers/mongo/cartsMongo.js";
import { ProductsMongo } from "../src/dao/managers/mongo/productsMongo.js";
import { cartsModel } from "../src/dao/models/carts.model.js";
import { productsModel } from "../src/dao/models/products.model.js";

const testDB = "mongodb+srv://Eduardo:8OlSRq8ep7hp7ueX@backendcoder.1qacdwm.mongodb.net/ecommerce_TEST?retryWrites=true&w=majority";
const expect = chai.expect;

describe("Pruebas para carritos", function(){

    before(async function(){
        await mongoose.connect(testDB);
        console.log("Base de datos conectada");
        this.cartsManager = new CartsMongo();
        this.productsManager = new ProductsMongo();
    });

    beforeEach(async function(){
        await cartsModel.deleteMany({});
        await productsModel.deleteMany({});
    });

    it("El método get debe retonar un arreglo de carritos", async function(){
        const response = await this.cartsManager.getCarts();
        expect(response).to.deep.equal([]);
    });

    it("El método add debe guardar un carrito en la DB", async function(){
        const mockProduct = {
            "name" : "Laundromatic",
            "price": "168",
            "category": "Ropa",
            "code": "1234",
            "stock": 846
        };

        const product = await this.productsManager.addProduct(mockProduct);
        const list = await this.productsManager.getProducts();

        const mockCart = {
            "products" : [
                {
                    "product":list[0]._id,
                    "quantity":15
                }
            ]
        };
        const response = await this.cartsManager.addCart(mockCart);
        const check = await this.cartsManager.getCarts();
        console.log(check[0]._id);
    });

    it("Se puede obtener un carrito por id", async function(){
        
        const mockProduct = {
            "name" : "Laundromatic",
            "price": "168",
            "category": "Ropa",
            "code": "1234",
            "stock": 846
        };
        const product = await this.productsManager.addProduct(mockProduct);
        const list = await this.productsManager.getProducts();

        const mockCart = {
            "products" : [
                {
                    "product":list[0]._id,
                    "quantity":15
                }
            ]
        };
        const response = await this.cartsManager.addCart(mockCart);
        const check = await this.cartsManager.getCarts();
        const cartWithId = await this.cartsManager.getCartById(check[0]._id);
        
        // Verifico que el objeto tenga cierta propiedad
        expect(cartWithId).to.haveOwnProperty('products');
    });
});