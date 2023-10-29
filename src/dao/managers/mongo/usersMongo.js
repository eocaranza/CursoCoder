import { usersModel } from "../../models/users.model.js"

export class usersMongo{
    constructor(){
        this.model = usersModel;
    }

    async save(user){
        try {
            const userCreated = this.model.create(user);
            return userCreated;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId){
        try {
            const user = this.model.findById(userId);
            if(user)
                return user;
            else
                throw new Error("El usuario no existe.");
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(userEmail){
        try {
            const user = this.model.findOne({email: userEmail});
            if(user)
                return user;
            else
                return null;
        } catch (error) {
            throw error;
        }
    }

    async update(userId, newuserInfo){
        try {
            const userUpdated = await this.model.findByIdAndUpdate(userId, newuserInfo, {new: true});
            return userUpdated;
        } catch (error) {
            throw error;
        }
    }
}