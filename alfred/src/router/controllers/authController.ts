import { Request, Response } from 'express';
import { User } from '../../entities/User';
import { UserRequest } from '../../entities/UserRequest';
import { getConnection } from 'typeorm';
import { generateToken, verifyToken } from '../utilities/tokenFactory';
import { DateTime } from 'luxon';
import {
  generateUser,
  generateUserFromRequest
} from '../utilities/userFactory';
import express from 'express';
import argon2 from 'argon2';

const authController = express.Router();

authController.post('/login', async (req: Request, res: Response) => {
  const connection = await getConnection();
  if (!req.body.login || !req.body.password) return res.sendStatus(400);

  const user = await connection.manager.findOne(User, {
    login: req.body.login
  });
  if (!user) return res.sendStatus(401);
  if (await argon2.verify(user.password, req.body.password)) {
    const token = generateToken({
      id: user.id,
      login: user.login,
      name: user.name,
      isAdmin: user.is_admin
    });
    user.last_login = DateTime.now().toUTC().toISO();
    user.save();
    return res.send({ access: token });
  }
  return res.sendStatus(401);
});

authController.get(
  '/verify',
  verifyToken,
  async (req: Request, res: Response) => {
    if (req.user) return res.sendStatus(200);
    return res.sendStatus(401);
  }
);

authController.get(
  '/users/list',
  verifyToken,
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();
    const users = await connection
      .createQueryBuilder(User, 'user')
      .select([
        'user.id',
        'user.login',
        'user.name',
        'user.is_admin',
        'user.last_login',
        'user.is_active'
      ])
      .getMany();

    return res.send(users);
  }
);

authController.post(
  '/users/create',
  verifyToken,
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(403);
    if (!req.user.isAdmin) return res.sendStatus(401);
    if (!req.body || !req.body.login || !req.body.name || !req.body.password)
      return res.sendStatus(400);

    const connection = await getConnection();
    const user = await generateUser(
      req.body.name,
      req.body.login,
      req.body.password,
      req.body.isAdmin
    );
    await connection.manager.save(user).catch((err) => {
      if (err.code === 'SQLITE_CONSTRAINT') return res.sendStatus(409);
      return res.sendStatus(500);
    });
    return res.sendStatus(201);
  }
);

authController.post(
  '/users/createInitial',
  async (req: Request, res: Response) => {
    if (!req.body || !req.body.login || !req.body.name || !req.body.password)
      return res.sendStatus(400);

    const connection = await getConnection();
    const userList = await connection.manager.find(User, {
      where: { is_admin: true }
    });
    if (userList.length > 0) return res.sendStatus(401);

    const user = await generateUser(
      req.body.name,
      req.body.login,
      req.body.password,
      true
    );
    await connection.manager.save(user).catch((err) => {
      if (err.code === 'SQLITE_CONSTRAINT') return res.sendStatus(409);
      return res.sendStatus(500);
    });
    return res.sendStatus(201);
  }
);

authController.post(
  '/users/deactivate',
  verifyToken,
  async (req: Request, res: Response) => {
    if (!req.user || !req.body.userId) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();

    const userToDeactivate = await connection.manager.findOne(User, {
      id: req.body.userId
    });

    if (!userToDeactivate) return res.sendStatus(404);
    if (userToDeactivate.id === req.user.id) return res.sendStatus(400);
    userToDeactivate.is_active = false;
    await connection.manager.save(userToDeactivate);
    return res.sendStatus(200);
  }
);

authController.post(
  '/users/delete',
  verifyToken,
  async (req: Request, res: Response) => {
    if (!req.user || !req.body.userId) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();

    const userToDelete = await connection.manager.findOne(User, {
      id: req.body.userId
    });
    if (!userToDelete) return res.sendStatus(404);
    if (userToDelete.id === req.user.id || userToDelete.is_active)
      return res.sendStatus(400);
    await connection.manager
      .delete(User, { id: userToDelete.id })
      .catch((err) => {
        console.error(err);
        return res.sendStatus(500);
      });
    return res.sendStatus(200);
  }
);

authController.post(
  '/users/reactivate',
  verifyToken,
  async (req: Request, res: Response) => {
    if (!req.user || !req.body.userId) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();

    const userToReactivate = await connection.manager.findOne(User, {
      id: req.body.userId
    });
    if (!userToReactivate) return res.sendStatus(404);
    if (userToReactivate.is_active) return res.sendStatus(409);
    userToReactivate.is_active = true;
    await connection.manager.save(userToReactivate);
    return res.sendStatus(200);
  }
);

authController.post(
  '/users/requests/new',
  async (req: Request, res: Response) => {
    if (!req.body.login || !req.body.password) return res.sendStatus(400);

    const connection = await getConnection();

    const existingUserCheck = await connection.manager.find(User, {
      login: req.body.login
    });
    const existingRequestCheck = await connection.manager.find(UserRequest, {
      login: req.body.login
    });
    if (existingUserCheck.length > 0 || existingRequestCheck.length > 0)
      return res.sendStatus(401);

    const user = new UserRequest();

    user.login = req.body.login;
    user.password = await argon2.hash(req.body.password);

    await connection.manager.save(user);
    return res.sendStatus(201);
  }
);

authController.post(
  '/users/requests/process',
  verifyToken,
  async (req: Request, res: Response) => {
    if (!req.user || !req.body.user) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();

    const request = await connection.manager.findOne(UserRequest, {
      where: { id: req.body.user.id }
    });
    if (!request) return res.sendStatus(400);
    if (!req.body.approve)
      await connection.manager.delete(UserRequest, request.id);
    if (!req.body.name) return res.sendStatus(400);

    const createdUser = await generateUserFromRequest(
      req.body.name,
      request.login,
      request.password,
      false
    );

    await connection.manager.save(createdUser);
    await connection.manager.delete(UserRequest, request.id);
    return res.sendStatus(201);
  }
);

authController.get(
  '/users/requests/list',
  verifyToken,
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();
    const userRequests = await connection.manager
      .createQueryBuilder(UserRequest, 'userRequest')
      .select([
        'userRequest.id',
        'userRequest.login',
        'userRequest.is_approved'
      ])
      .getMany();

    return res.send(userRequests);
  }
);

export default authController;
