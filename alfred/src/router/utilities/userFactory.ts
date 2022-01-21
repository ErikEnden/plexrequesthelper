import { User } from "../../entities/User";
const argon2 = require('argon2');

export const generateUser = async (name: string, login: string, password:string, isAdmin:boolean) =>  {
    let user = new User()

    user.name = name
    user.login = login
    user.password = await argon2.hash(password)
    user.is_admin = isAdmin
    
    return user
};