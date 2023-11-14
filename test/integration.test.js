import {app} from '../src/app.js';
import supertest from 'supertest';
import chai from 'chai';
import { productsModel } from "../src/dao/models/products.model.js";
import { usersModel } from '../src/dao/models/users.model.js';
import { cartsModel } from '../src/dao/models/carts.model.js';

const expect = chai.expect;
const requester = supertest(app); //Elemento para hacer peticiones

describe("Test de ecommerce",async function(){
    this.timeout(10000);

    before(async function(){
        await usersModel.deleteMany({});
        await productsModel.deleteMany({});
        await cartsModel.deleteMany({});
    });

    describe("Test de session", async function(){
        it("El método POST en api/sessions/signup debe dar de alta un usuario", async function(){
            const mockUser = {
                "first_name": "Usuario",
                "last_name": "Test",
                "age": "99",
                "email": "test@test.com",
                "password": "1234"
            };
            const response = await requester.post("/api/sessions/signup").send(mockUser);
        });

        it("El endpoint POST de /api/sessions/login nos permite logguearnos", async function(){
            const mockUser = {
                "email" : "test@test.com",
                "password" : "1234"
            };
            const response = await requester.post("/api/sessions/login").send(mockUser);
        });
    });
    
    describe("Test de productos",async function(){

        it("El endpoint POST de /api/products nos permite crear un producto", async function(){
            const mockProduct = {
                "name" : "Laundromatic",
                "price": "168",
                "category": "Ropa",
                "code": "1234",
                "stock": 846
            };
            const response = await requester.post("/api/products").send(mockProduct);
        });
    });

    describe("Test de carritos",async function(){

        it("El endpoint POST de /api/carts nos permite crear un carrito a partir de un producto", async function(){

            const products = await requester.get("/api/products");
            const mockCart = {
                "products":[
                    {
                        "product": products.body.data[0]._id,
                        "quantity": 15
                    }
                ]
            };
            const response = await requester.post("/api/carts").send(mockCart);
            const carts = await requester.get("/api/carts");
            //console.log(carts.body.data[0]);
        });
    });
});