import { UsersService } from "../services/users.services.js";

export class UsersController{
    
    static modifyRole = async(req, res) =>{
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;

            if(userRole === "user")
                user.role = "premium";
            else
            if(userRole === "premium")
                user.role = "user";
            else
            if(userRole === "admin")
                return res.json({status: "error", message: "No se puede cambiar el rol de este usuario"});
            
            await UsersService.updateUser(user._id, user);
            return res.json({status: "success", message: "Se ha cambiado el rol de este usuario"});
        } catch (error) {
            console.log(error.message);
        }
    };
}