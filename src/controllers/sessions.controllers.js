import { UserDto } from "../dao/dto/user.dto.js";
import { UsersService } from '../services/users.services.js'
import { addLogger } from "../helpers/logger.js";
import { generateEmailWithToken, recoveryEmail } from "../helpers/gmail.js";

const logger = addLogger();

export class SessionsController{

    static async signup(req, res){
        res.redirect("/products");
    }

    static async failSignup(req, res){
        res.render("signup", {error: "No se pudo registrar el usuario"})
    }

    static async login(req, res){
        res.redirect("/products");
    }
    
    static async failLogin(req, res){
        res.render("login", {error: "Error al iniciar sesion"})
    }

    static async githubCallback(req, res){
        res.redirect("/products");
    }

    static async logout(req, res){
        req.session.destroy(error => {
            if(error) return res.redirect("/products");
            else return res.redirect("/");
        });
    }

    static async current(req, res){
        if(req.user){
            const userData = req.user;
            const dtoInfo = new UserDto(userData);    
            res.render("current", {user: dtoInfo});
        }
        else
            res.render("current", {error: "No se encuentra loggeado"});
    }

    static async forgotPassword(req, res){
        try {
            const {email} = req.body;
            const user = await UsersService.getUserByEmail(email);
            if(!user)
                return res.json({status: "error", error: "El usuario no existe"});

            const token = generateEmailWithToken(email, 3*60)
            await recoveryEmail(email, token);
            res.send("Correo enviado");
        } catch (error) {
            logger.info(error.message);
        }
    }
}