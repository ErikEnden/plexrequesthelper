import { verifyToken } from "../utilities/tokenFactory";
import { Request, Response } from 'express';
import { MediaRequest } from "../../entities/MediaRequest";
import { getConnection } from 'typeorm';
import { User } from "../../entities/User";
const requestController = require('express').Router();

requestController.get('/list', [verifyToken], async (req: Request, res: Response) => {
    const connection = getConnection()
    let data = null
    if(req.user) {
        let user = connection.manager.findOne(User, {id: req.user.id})
        console.log(user)
        if(!req.user.isAdmin) {
            data = await connection.manager.find(MediaRequest, where: {requester: user})
        }
        else {
            data = connection.manager.find(MediaRequest)
        }
    } else {
        res.sendStatus(400)
    }
})

export default requestController