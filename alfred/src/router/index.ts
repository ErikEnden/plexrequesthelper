import {Request, Response} from 'express';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';
const argon2 = require('argon2')
const jwt = require('jsonwebtoken');
const Router = require('express').Router()

type UserData = {
    id: number,
    email: string
}

const generateToken = (user: UserData) => {
    return jwt.sign(user, process.env.JWT_SECRET_KEY, {expiresIn: '2h'})
}

const verifyToken = (req: Request, res: Response, next: any) => {
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

Router.post('/login', async (req: Request, res: Response) => {
    const connection = getConnection()
    console.log(req.body)
    if(req.body.email && req.body.password) {
        const user = await connection.manager.findOne(User, {email: req.body.email})
        if(user && await argon2.verify(user.password, req.body.password)) {
            const token = generateToken({id: user.id, email: user.email})
            res.send({access: token})
        } else {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(400)
    }
})

Router.get('/verify', verifyToken, async (req: Request, res: Response) => {
    if(req.user) res.sendStatus(200)
    else res.sendStatus(401) 
})
export default Router