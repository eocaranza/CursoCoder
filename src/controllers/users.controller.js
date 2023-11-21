import { UsersService } from "../services/users.services.js";

export class UsersController{
    
    static modifyRole = async(req, res) =>{
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);
            const userRole = user.role;

            //const reference = req.file.path;

            let uploaded = false;
            let names = [];

            for (let i = 0; i < user.documents.length; i++) {
                names.push(user.documents[i].name);
            }
            
            uploaded = names.includes('Identificacion') &&
                        names.includes('Comprobante de domicilio') &&
                        names.includes('Comprobante de estado de cuenta');

            if(userRole === "user")
                if(uploaded)
                    user.role = "premium";
                else
                return res.json({status: "error", message: "Son necesarios documentos"});
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

    static uploadFiles = async(req, res) =>{
        try {
            const userId = req.params.uid;
            const user = await UsersService.getUserById(userId);

            user.documents.push({
                name: req.body.name,
                reference: req.body.reference
            });

            await UsersService.updateUser(userId, user);

            return res.json({status: "success", message: "Se ha subido la documentación"});
        } catch (error) {
            console.log(error.message);
        }
    };
}