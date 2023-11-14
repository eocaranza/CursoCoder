import {app} from '../src/app.js';
import supertest from 'supertest';
import chai from 'chai';
import { productsModel } from "../src/dao/models/products.model.js";

const expect = chai.expect;
const requester = supertest(app); //Elemento para hacer peticiones

describe("Test de ecommerce",async function(){
    this.timeout(10000);

    before(async function(){
        await usersModel.deleteMany({});
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
            const response = await this.userManager.save(mockUser);
            
            // Verifico que el objeto tenga cierta propiedad
            expect(response).to.have.property('_id');
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

        beforeEach(async function(){
            await productsModel.deleteMany({});
        });

        it("El endpoint POST de /api/products nos permite crear un producto", async function(){
            const mockProduct = {
                "name" : "Laundromatic",
                "price": "168",
                "category": "Ropa",
                "code": "1234",
                "stock": 846
            };
            const response = await requester.post("/api/products").send(mockProduct);
            console.log(response.body.payload);
        });
    });
});