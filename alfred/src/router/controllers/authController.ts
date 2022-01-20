import { Request, Response } from 'express';
import { User } from '../../entities/User';
import { getConnection } from 'typeorm';
import { generateToken, verifyToken } from '../utilities/tokenFactory';
import { DateTime } from 'luxon';
const authController = require('express').Router()
const argon2 = require('argon2')

authController.post('/login', async (req: Request, res: Response) => {
    const connection = await getConnection()
    if(!req.body.email || !req.body.password) return res.sendStatus(400)
    
    const user = await connection.manager.findOne(User, {email: req.body.email})
    if(!user) return res.sendStatus(401)
    if(await argon2.verify(user.password, req.body.password)) {
        const token = generateToken({id: user.id, email: user.email, isAdmin: user.isAdmin})
        user.last_login = DateTime.now().toUTC().toISO()
        user.save()
        return res.send({access: token})
    } else return res.sendStatus(401)
})

authController.get('/verify', verifyToken, async (req: Request, res: Response) => {
    if(req.user) res.sendStatus(200)
    else res.sendStatus(401) 
})

authController.get('/users/list', verifyToken, async (req: Request, res: Response) => {
    if(!req.user) return res.sendStatus(400)
    if(!req.user.isAdmin) return res.sendStatus(401)

    const connection = await getConnection()
    const users = await connection.createQueryBuilder(User, "user").select(["user.id", "user.email", "user.name","user.isAdmin", "user.last_login"]).getMany()

    return res.send(users);
})

export default authController