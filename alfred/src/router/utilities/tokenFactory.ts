const jwt = require('jsonwebtoken');
import { UserData } from '../types/user';
import { Request, Response } from 'express';

export const generateToken = (user: UserData) => {
    return jwt.sign(user, process.env.JWT_SECRET_KEY, {expiresIn: '2h'})
}

export const verifyToken = (req: Request, res: Response, next: any) => {
    const header = req.headers.authorization
    const token = header && header.split(' ')[1]
    if(!token) return res.sendStatus(400)

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err: any, user: any) => {
        if(err) return res.sendStatus(403)

        req.user = user;
        next();
        return;
    })
    return;
}