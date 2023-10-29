import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";
import { gmailTransporter } from '../config/gmail.config.js';
import { addLogger } from "../helpers/logger.js";

const logger = addLogger();

export const generateEmailWithToken = (email, expireTime) => {
    //genera el token
    const token = jwt.sign({email}, config.gmail.secretToken, {expiresIn:expireTime});
    return token;
};

export const recoveryEmail = async(userEmail, emailToken) =>{
    try {
        const domain = `${req.protocol}://${req.get('host')}`;
        const link = `${domain}/reset-password?token=${emailToken}`;
        await gmailTransporter.sendMail({
            from: "Ecommerce Coder",
            to: userEmail,
            subject: "Establece tu contraseña",
            html: `
                <p> Solicitaste cambiar tu contraseña</p>
                <p> Da click en este enlace: <a href= ${link}> Restablecer contraseña </a> <p>
            `
        });
    } catch (error) {
        logger.info("Aviso nivel info");
    }
};