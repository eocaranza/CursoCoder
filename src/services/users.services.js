import { userDao } from "../dao/factory.js";

export class UsersService{
    
    static async getUserById(userId){
        return userDao.getUserById(userId);
    }

    static async getUserByEmail(email){
        return userDao.getUserByEmail(email);
    }

    static async save(user){
        return userDao.save(user);
    }

    static updateUser = async(userId, userInfo) => {
        return userDao.update(userId, userInfo);
    }

    static async getAllUsers(){
        return userDao.getAllUsers();
    }
}