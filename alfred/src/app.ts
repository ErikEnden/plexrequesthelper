import { ConnectionOptions, createConnection } from "typeorm";
import { User } from "./entities/User";
import { Request } from './entities/Request';
import Router from './router'
const express =  require('express');
const app = express();
const argon2 = require('argon2')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()

const connectionOptions: ConnectionOptions = {
    type: "sqlite",
    database: "./db.sqlite",
    entities: [User, Request],
    logging: true,
    synchronize: true
}

const generateTestUser = async () =>  {
    let user = new User()

    user.name = process.env.TESTUSER_NAME
    user.email = process.env.TESTUSER_EMAIL
    user.password = await argon2.hash(process.env.TESTUSER_PASSWORD)
    user.isAdmin = true
    
    return user
}

const main = async () => {
    const connection = await createConnection(connectionOptions)
    app.use(cors());
    app.use(bodyParser())
    app.use(Router);

    const testUser = await connection.manager.find(User, {email: 'default@admin.com'})
    let testUserData = await generateTestUser()
    if(testUser.length === 0) await connection.manager.save(testUserData)

    app.listen(3000, () => {
        console.log('Listening at localhost:3000')
    })
}

main()