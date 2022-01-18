import { checkIsAdmin } from "../middleware/checkAdmin";
import { verifyToken } from "../utilities/tokenFactory";
import { Request, Response } from 'express';
import { MediaRequest } from "../../entities/MediaRequest";
import { getConnection } from 'typeorm';
const requestController = require('express').Router();

requestController.get('/list', [verifyToken], (req: Request, res: Response) => {
    const connection = getConnection()
    let data = null
    if(req.user) {
        if(!req.user.isAdmin) {
            data = connection.manager.find(Request, {requester: req.user})
        }
        else {
            data = connection.manager.find(Request)
        }
    } else {
        res.sendStatus(400)
    }
})

export default requestController