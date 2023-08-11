import mongoose from "mongoose";

// nombre de la coleccion de carts
const cartsCollection = "carts";

// esquema de carts
const cartSchema = new mongoose.Schema({
    products:{
        type: [{
            id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
            },
            quantity:{
                type: Number,
                default: 1
            }
        }],
        required: true
    }
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);