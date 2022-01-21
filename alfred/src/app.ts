import { ConnectionOptions, createConnection } from "typeorm";
import { User } from "./entities/User";
import { MediaRequest } from './entities/MediaRequest';
import initializeRouter from './router';
import {generateUser} from './router/utilities/userFactory';
const express =  require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const connectionOptions: ConnectionOptions = {
    type: "sqlite",
    database: "./db.sqlite",
    entities: [User, MediaRequest],
    logging: true,
    synchronize: true
}



const main = async () => {
    const connection = await createConnection(connectionOptions)
    app.use(cors());
    app.use(express.json())
    initializeRouter(app)

    const testUser = await connection.manager.findOne(User, {login: process.env.TESTUSER_EMAIL})
    if(!testUser) {
        let testUserData = await generateUser(process.env.TESTUSER_NAME, process.env.TESTUSER_LOGIN, process.env.TESTUSER_PASSWORD, true)
        await connection.manager.save(testUserData)
    }

    app.listen(3000, () => {
        console.log('Listening at localhost:3000')
    })
}

main()