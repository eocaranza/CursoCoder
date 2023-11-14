import mongoose from "mongoose";
import Assert from 'assert';
import { usersMongo } from "../src/dao/managers/mongo/usersMongo.js";
import { usersModel } from "../src/dao/models/users.model.js";

const testDB = "mongodb+srv://Eduardo:8OlSRq8ep7hp7ueX@backendcoder.1qacdwm.mongodb.net/ecommerce_TEST?retryWrites=true&w=majority";
const assert = Assert.strict;

describe("Pruebas para sesiones", function(){

    before(async function(){
        await mongoose.connect(testDB);
        console.log("Base de datos conectada");
        this.userManager = new usersMongo();
    });

    beforeEach(async function(){
        await usersModel.deleteMany({});
    });

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
        assert.ok(response._id);
    });

    it("Al dar de alta un usuario, su rol debe ser user por defecto", async function(){
        const mockUser = {
            "first_name": "Usuario",
            "last_name": "Test",
            "age": "99",
            "email": "test@test.com",
            "password": "1234"
        };
        const response = await this.userManager.save(mockUser);
        assert.strictEqual(response.role,'user');
    });

    it("Se debe poder obtener un usuario por su email", async function(){
        const mockUser = {
            "first_name": "Usuario",
            "last_name": "Test",
            "age": "99",
            "email": "test@test.com",
            "password": "1234"
        };
        const response = await this.userManager.save(mockUser);
        const userFound = await this.userManager.getUserByEmail("test@test.com");
        // Verifico que el objeto tenga cierta propiedad
        assert.ok(userFound.first_name);
    });
});