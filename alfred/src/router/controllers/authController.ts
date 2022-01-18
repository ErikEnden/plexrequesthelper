import { Request, Response } from 'express';
import { User } from '../../entities/User';
import { getConnection } from 'typeorm';
import { generateToken, verifyToken } from '../utilities/tokenFactory';
const authController = require('express').Router()
const argon2 = require('argon2')

authController.post('/login', async (req: Request, res: Response) => {
    const connection = getConnection()
    if(req.body.email && req.body.password) {
        const user = await connection.manager.findOne(User, {email: req.body.email})
        if(user && await argon2.verify(user.password, req.body.password)) {
            const token = generateToken({id: user.id, email: user.email, isAdmin: user.isAdmin})
            res.send({access: token})
        } else {
            res.sendStatus(401)
        }
    } else {
        res.sendStatus(400)
    }
})

authController.get('/verify', verifyToken, async (req: Request, res: Response) => {
    if(req.user) res.sendStatus(200)
    else res.sendStatus(401) 
})

export default authController