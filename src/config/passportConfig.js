import passport from "passport";
import { createHash, isValidPassword } from "../utils.js";
import { userService } from "../dao/index.js";
import githubStratregy from "passport-github2";
import { config } from "./config.js";

export const initializePassport = () =>{
    passport.use("githubLoginStrategy", new githubStratregy(
    {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackUrl: config.github.callbackUrl
    },
    async(accesstoken, refreshtoken, profile, done) => {
        try {
            console.log(profile);
            //verificar registro en la app
            const user = await userService.getUserByEmail(profile.username);

            if(!user){
                const newUser = {
                    first_name: profile.username,
                    email: profile.username,
                    password: createHash(profile.id)
                }
                const userCreated = await userService.save(newUser);
                return done(null, userCreated);
            } else{
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
};