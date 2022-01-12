import { ConnectionOptions, createConnection } from "typeorm";
import { User } from "./entities/User";
import { Request } from './entities/Request';
import Router from './router'
const express =  require('express');
const app = express();
const argon2 = require('argon2')

const connectionOptions: ConnectionOptions = {
    type: "sqlite",
    database: "./db.sqlite",
    entities: [User, Request],
    logging: true,
    synchronize: true
}

const generateTestUser = async () =>  {
    let user = new User()

    user.name = "admin"
    user.email = "default@admin.com"
    user.password = await argon2.hash('testpassword')
    user.isAdmin = true
    
    return user
}

const main = async () => {
    const connection = await createConnection(connectionOptions)
    app.use(Router);

    const testUser = await connection.manager.find(User, {email: 'default@admin.com'})
    let testUserData = await generateTestUser()
    if(testUser.length === 0) await connection.manager.save(testUserData)

    app.listen(3000, () => {
        console.log('Listening at localhost:3000')
    })
}

main()