import mongoose from "mongoose";
import chai from "chai";
import { ProductsMongo } from "../src/dao/managers/mongo/productsMongo.js";
import { productsModel } from "../src/dao/models/products.model.js";

const expect = chai.expect;
const testDB = "mongodb+srv://Eduardo:8OlSRq8ep7hp7ueX@backendcoder.1qacdwm.mongodb.net/ecommerce_TEST?retryWrites=true&w=majority";

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
        expect(response).to.deep.equal([]);
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
        expect(check[0]).to.haveOwnProperty('_id');
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

        expect(prodWithId.name).to.deep.equal("Laundromatic");
    });

    it("El metodo update debe actualizar un producto", async function(){
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

        prodWithId.name = "Zapatillas";

        const update = await this.productsManager.updateProduct(check[0]._id, prodWithId);
        const doubleCheck = await this.productsManager.getProducts();
        const updatedProd = await this.productsManager.getProductById(doubleCheck[0]._id);

        expect(updatedProd.name).to.deep.equal("Zapatillas");
    });
});