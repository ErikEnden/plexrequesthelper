import {Request, Response} from 'express';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';
const argon2 = require('argon2')
const jwt = require('jsonwebtoken');
const Router = require('express').Router()

Router.post('/login', async (req: Request, res: Response) => {
    const connection = getConnection()
    console.log(req.body)
    if(req.body.email && req.body.password) {
        const user = await connection.manager.findOne(User, {email: req.body.email})
        if(user && await argon2.verify(user.password, req.body.password)) {
            const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET_KEY, {expiresIn: "2h"})

            res.send({access: token})
        } else {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(400)
    }
})

Router.post('/verify', async (req: Request, res: Response) => {
    if(req.body.access) {
        let verification = jwt.verify(req.body.access, process.env.JWT_SECRET_KEY)
        console.log(verification)
        res.sendStatus(200)
    } else {
        res.sendStatus(400)
    }
})
export default Router