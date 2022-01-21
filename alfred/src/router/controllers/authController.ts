import { Request, Response } from 'express';
import { User } from '../../entities/User';
import { getConnection } from 'typeorm';
import { generateToken, verifyToken } from '../utilities/tokenFactory';
import { DateTime } from 'luxon';
import { generateUser } from '../utilities/userFactory';
const authController = require('express').Router()
const argon2 = require('argon2')

authController.post('/login', async (req: Request, res: Response) => {
    const connection = await getConnection()
    if(!req.body.login || !req.body.password) return res.sendStatus(400)
    
    const user = await connection.manager.findOne(User, {login: req.body.login})
    if(!user) return res.sendStatus(401)
    if(await argon2.verify(user.password, req.body.password)) {
        const token = generateToken({id: user.id, login: user.login, isAdmin: user.is_admin})
        user.last_login = DateTime.now().toUTC().toISO()
        user.save()
        return res.send({access: token})
    } 
    return res.sendStatus(401)
})

authController.get('/verify', verifyToken, async (req: Request, res: Response) => {
    if(req.user) return res.sendStatus(200)
    return res.sendStatus(401) 
})

authController.get('/users/list', verifyToken, async (req: Request, res: Response) => {
    if(!req.user) return res.sendStatus(400)
    if(!req.user.isAdmin) return res.sendStatus(401)

    const connection = await getConnection()
    const users = await connection.createQueryBuilder(User, "user").select(["user.id", "user.login", "user.name","user.is_admin", "user.last_login", "user.is_active"]).getMany()

    return res.send(users);
})

authController.post('/users/create', verifyToken, async (req: Request, res:Response) => {
    if(!req.user) return res.sendStatus(403);
    if(!req.user.isAdmin) return res.sendStatus(401);
    if(!req.body || !req.body.login || !req.body.name || !req.body.password) return res.sendStatus(400);

    const connection = await getConnection()
    const user = await generateUser(req.body.name, req.body.login, req.body.password, req.body.isAdmin);
    await connection.manager.save(user).catch(err => {
        if(err.code === 'SQLITE_CONSTRAINT') return res.sendStatus(409)
        return res.sendStatus(500);
    });
    return res.sendStatus(201);
})

authController.post('/users/deactivate', verifyToken, async (req: Request, res: Response) => {
    if(!req.user || !req.body.userId) return res.sendStatus(400);
    if(!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();

    const userToDeactivate = await connection.manager.findOne(User, {id: req.body.userId})

    if(!userToDeactivate) return res.sendStatus(404);
    if(userToDeactivate.id === req.user.id) return res.sendStatus(400);
    userToDeactivate.is_active = false;
    await connection.manager.save(userToDeactivate);
    return res.sendStatus(200);
})

authController.post('/users/delete', verifyToken, async (req: Request, res: Response) => {
    if(!req.user || !req.body.userId) return res.sendStatus(400);
    if(!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();

    const userToDelete = await connection.manager.findOne(User, {id: req.body.userId})
    if(!userToDelete) return res.sendStatus(404)
    if(userToDelete.id === req.user.id || userToDelete.is_active) return res.sendStatus(400)
    await connection.manager.delete(User, {id: userToDelete.id}).catch(err => {
        console.error(err);
        return res.sendStatus(500);
    })
    return res.sendStatus(200);
})

authController.post('/users/reactivate', verifyToken, async (req: Request, res: Response) => {
    if(!req.user || !req.body.userId) return res.sendStatus(400);
    if(!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();

    const userToReactivate = await connection.manager.findOne(User, {id: req.body.userId})
    if(!userToReactivate) return res.sendStatus(404)
    if(userToReactivate.is_active) return res.sendStatus(409)
    userToReactivate.is_active = true;
    await connection.manager.save(userToReactivate);
    return res.sendStatus(200);
})

export default authController