import mongoose from "mongoose";
import Assert from 'assert';
import { ProductsMongo } from "../src/dao/managers/mongo/productsMongo.js";
import { productsModel } from "../src/dao/models/products.model.js";

const testDB = "mongodb+srv://Eduardo:8OlSRq8ep7hp7ueX@backendcoder.1qacdwm.mongodb.net/ecommerce_TEST?retryWrites=true&w=majority";
const assert = Assert.strict;

describe("Pruebas para productos", function(){

    before(async function(){
        await mongoose.connect(testDB);
        console.log("Base de datos conectada");
        this.productsManager = new ProductsMongo();
    });

    beforeEach(async function(){
        await productsModel.deleteMany({});
    });

    it("El método get debe retonar un arreglo de productos", async function(){
        const response = await this.productsManager.getProducts();
        assert.strictEqual(Array.isArray(response),true);
    });

    it("El método add debe guardar un producto en la DB", async function(){
        const mockProduct = {
            "name" : "Laundromatic",
            "price": "168",
            "category": "Ropa",
            "code": "1234",
            "stock": 846
        };
        const response = await this.productsManager.addProduct(mockProduct);
        const check = await this.productsManager.getProducts();

        // Verifico que el objeto tenga cierta propiedad
        assert.ok(check[0]._id);
    });

    it("Se puede obtener un producto por id", async function(){
        const mockProduct = {
            "name" : "Laundromatic",
            "price": "168",
            "category": "Ropa",
            "code": "1234",
            "stock": 846
        };
        const response = await this.productsManager.addProduct(mockProduct);
        const check = await this.productsManager.getProducts();
        const prodWithId = await this.productsManager.getProductById(check[0]._id);

        assert.strictEqual(prodWithId.name, "Laundromatic");
    });
});