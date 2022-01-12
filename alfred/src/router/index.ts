import {Request, Response} from 'express';
import { User } from '../entities/User';
import { getConnection } from 'typeorm';
const argon2 = require('argon2')
const jwt = require('jsonwebtoken');
const Router = require('express').Router()

Router.post('/login', async (req: Request, res: Response) => {
    const connection = getConnection()

    if(req.body.user.email && req.body.user.password) {
        const user = await connection.manager.findOne(User, {email: req.body.user.email})

        if(user && await argon2.verify(user.password, req.body.user.password)) {
            const token = jwt.sign({id: user.id, email: user.email})

            res.send({access: token})
        } else {
            res.sendStatus(403)
        }
    }
})

export default Router