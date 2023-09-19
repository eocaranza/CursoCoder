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
}