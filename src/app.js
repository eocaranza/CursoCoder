import express from "express";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { viewsRouter } from "./routes/views.routes.js";
import { config } from "./config/config.js";
import { engine } from 'express-handlebars';
import { __dirname } from "./utils.js";
import path from 'path';
import { Server } from "socket.io";
import { chatModel } from "./dao/models/chat.model.js";
import { loginRouter } from "./routes/login.routes.js";
import session from "express-session";
import MongoStore from "connect-mongo";

const port = config.server.port;

//creamos la aplicacion del servidor
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session({
    store:MongoStore.create({
        ttl:40,
        mongoUrl:"mongodb+srv://Eduardo:8OlSRq8ep7hp7ueX@backendcoder.1qacdwm.mongodb.net/sessionsDB?retryWrites=true&w=majority"
    }),
    secret:"sessionSecretKey",
    resave: true,
    saveUninitialized: true
}));

//levantar el servidor
const httpServer = app.listen(port,()=>console.log(`El servidor esta escuchando en el puerto ${port}`));

//configuracion de handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, "/views"));

//crear server websocket
const socketServer = new Server(httpServer);

//socket server
socketServer.on("connection",(socket)=>{
    console.log("Nuevo cliente conectado");
    
    socket.on("authenticated", async (msg)=>{
        const messages = await chatModel.find();
        socket.emit("messageHistory", messages);
        socket.broadcast.emit("newUser",msg);
    });

    //recibir el mensaje del cliente
    socket.on("message", async (data)=>{
        console.log("data",data);
        const messageCreated = await chatModel.create(data);
        const messages = await chatModel.find();
        socketServer.emit("messageHistory", messages);
    })
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use(viewsRouter);
app.use(loginRouter);