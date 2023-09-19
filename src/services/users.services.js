import { userDao } from "../dao/index.js";

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
}