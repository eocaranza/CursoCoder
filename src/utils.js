import bcrypt from "bcrypt";
import path from 'path';
import { fileURLToPath } from 'url';
import {faker, Faker, es ,en} from '@faker-js/faker';

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync());
}

export const isValidPassword = (userDB, password) => {
    return bcrypt.compareSync(password, userDB?.password);
}

const {database, commerce, string, person, internet} = faker;

export const generateProduct = () =>{
    return {
        id : database.mongodbObjectId(),
        name: commerce.productName(),
        price: parseFloat(commerce.price()),
        code: string.alphanumeric(10),
        category: commerce.department(),
        stock: parseInt(string.numeric(3))
    };
}

export const generateUser = () => {
    const numberOfProducts = parseInt(string.numeric(1));

    let products = [];

    for(let i = 1; i < numberOfProducts; i++){
        const newProduct = generateProduct();
        products.push(newProduct);
    };

    return {
        id: database.mongodbObjectId(),
        first_name: person.firstName(),
        last_name: person.lastName(),
        email: internet.email(),
        age: parseInt(string.numeric(2)),
        //password:,
        cart: products,
        role: "user"
    };
}