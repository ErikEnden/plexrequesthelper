import jwt = require('jsonwebtoken');
import { User } from '../../entities/User';
import { UserData } from '../types/user';
import { Request, Response } from 'express';
import { getConnection } from 'typeorm';

export const generateToken = (user: UserData) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '2h' });
};

export const verifyToken = (req: Request, res: Response, next: any) => {
  const header = req.headers.authorization;
  const token = header && header.split(' ')[1];
  if (!token) return res.sendStatus(400);

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err: any, user: any) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    const conn = await getConnection();
    const dbUser = await conn.manager.findOne(User, { id: user.id });
    if (!dbUser) return res.sendStatus(400);
    if (!dbUser.is_active) return res.sendStatus(401);
    next();
    return;
  });
  return;
};
