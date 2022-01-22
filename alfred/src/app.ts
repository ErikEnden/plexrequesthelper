import { ConnectionOptions, createConnection } from 'typeorm';
import { User } from './entities/User';
import { MediaRequest } from './entities/MediaRequest';
import initializeRouter from './router';
import { generateUser } from './router/utilities/userFactory';
import express = require('express');
import cors = require('cors');
import dotenv = require('dotenv');

const app = express();
dotenv.config();

const connectionOptions: ConnectionOptions = {
  type: 'sqlite',
  database: './db.sqlite',
  entities: [User, MediaRequest],
  logging: false,
  synchronize: true
};

const main = async () => {
  const connection = await createConnection(connectionOptions);
  app.use(cors());
  app.use(express.json());
  initializeRouter(app);

  const testUser = await connection.manager.findOne(User, {
    login: process.env.TESTUSER_EMAIL
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

  app.listen(3000, () => {
    console.log('Listening at localhost:3000');
  });
};

main();
