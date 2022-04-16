import { ConnectionOptions, createConnection } from 'typeorm';
import { User } from './entities/User';
import { MediaRequest } from './entities/MediaRequest';
import initializeRouter from './router';
import { generateUser } from './router/utilities/userFactory';
import express = require('express');
import cors = require('cors');
import dotenv = require('dotenv');
import helmet from 'helmet';
import { UserRequest } from './entities/UserRequest';

const app = express();
dotenv.config();

const connectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: './db.sqlite',
  entities: [User, MediaRequest, UserRequest],
  logging: false,
  synchronize: true
};

const main = async () => {
  const connection = await createConnection(connectionOptions);
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  initializeRouter(app);

  const testUser = await connection.manager.findOne(User, {
    login: process.env.TESTUSER_LOGIN
  });
  if (!testUser) {
    const testUserData = await generateUser(
      process.env.TESTUSER_NAME,
      process.env.TESTUSER_LOGIN,
      process.env.TESTUSER_PASSWORD,
      true
    );
    await connection.manager.save(testUserData);
  }

  app.use(express.static('public'));
  app.listen(process.env.APP_PORT, () => {
    console.log('Listening at localhost:3000');
  });
};

main();
