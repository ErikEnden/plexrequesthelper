import { verifyToken } from "../utilities/tokenFactory";
import { Request, Response } from 'express';
import { MediaRequest } from "../../entities/MediaRequest";
import { getConnection } from 'typeorm';
import { User } from "../../entities/User";
import { DateTime } from "luxon";
import Status from "../types/status";
const requestController = require('express').Router();

requestController.get('/list', [verifyToken], async (req: Request, res: Response) => {
    const connection = getConnection()
    console.log(req.user);
    if(req.user) {
        let data = null
        if(!req.user.isAdmin) {
            let user = await connection.manager.findOne(User, {id: req.user.id})
            data = await connection.manager.find(MediaRequest, {requester: user})
            res.send({results: data})
        }
        else {
            data = await connection.manager.find(MediaRequest, {relations: ["requester"]})
            console.log(data)
            res.send({results: data})
        }
    } else {
        res.sendStatus(400)
    }
})

requestController.get('/list/compact', [verifyToken], async (req: Request, res: Response) => {
    const connection = getConnection()
    if(!req.user) return res.sendStatus(400)
    let data
    
    if(req.user.isAdmin) {
        data = await connection.manager.find(MediaRequest, {relations: ["requester"]})
        console.log(data)
        return res.send({results: data})
    }

    let user = await connection.manager.findOne(User, {id: req.user.id})
    data = await connection.createQueryBuilder(MediaRequest, "request").select("request").where("request.user = :user", {user: user})
    return res.send({results: data})
})

requestController.post('/new', [verifyToken], async (req: Request, res: Response) => {
    const connection = getConnection()
    let user
    console.log(req.user)
    if(req.user) user = await connection.manager.findOne(User, {id: req.user.id})
    else res.sendStatus(401)
    console.log(user)
    console.log(req.body)
    if(!req.body.target) res.sendStatus(400)

    if(user && req.body.target) {
        let request = new MediaRequest()
        request.tmdb_id = req.body.target.id;
        request.title = req.body.target.title;
        request.release_date = req.body.target.release_date;
        request.poster_url = req.body.poster_url
        request.created_at = DateTime.now().toUTC().toISO();
        request.requester = user;
        request.notes = req.body.notes;
        request.status = Status.Requested;

        connection.manager.save(request).then(() => {
            res.sendStatus(201)
        }).catch(err => {
            console.error(err);
            res.sendStatus(500)
        });
    }
})

requestController.patch('/accept/:requestId', [verifyToken], async (req: Request<{requestId: number}>, res: Response) => {
    if(!req.user) return res.sendStatus(400)
    if(!req.user.isAdmin) return res.sendStatus(401)
    
    const connection = await getConnection()
    const request = await connection.manager.findOne(MediaRequest, {id: req.params.requestId}, {relations: ["requester"]})

    if(!request) return res.sendStatus(500)
    request.status = Status.Accepted

    connection.manager.save(request)
    res.send(request)
    return;
})
requestController.patch('/reject/:requestId', [verifyToken], async (req: Request<{requestId: number}>, res: Response) => {
    if(!req.user) return res.sendStatus(400)
    if(!req.user.isAdmin) return res.sendStatus(401)
    
    const connection = await getConnection()
    const request = await connection.manager.findOne(MediaRequest, {id: req.params.requestId}, {relations: ["requester"]})

    if(!request) return res.sendStatus(500)
    request.status = Status.Rejected

    connection.manager.save(request)
    res.send(request)
    return;
})

requestController.patch('/fulfill/:requestId', [verifyToken], async (req: Request<{requestId: number}>, res: Response) => {
    if(!req.user) return res.sendStatus(400)
    if(!req.user.isAdmin) return res.sendStatus(401)
    
    const connection = await getConnection()
    const request = await connection.manager.findOne(MediaRequest, {id: req.params.requestId}, {relations: ["requester"]})

    if(!request) return res.sendStatus(500)
    request.status = Status.Fulfilled

    connection.manager.save(request)
    res.send(request)
    return;
})

requestController.patch('/cancel/:requestId', [verifyToken], async (req: Request<{requestId: number}>, res: Response) => {
    if(!req.user) return res.sendStatus(400)
    if(!req.user.isAdmin) return res.sendStatus(401)
    
    const connection = await getConnection()
    const request = await connection.manager.findOne(MediaRequest, {id: req.params.requestId}, {relations: ["requester"]})

    if(!request) return res.sendStatus(500)
    request.status = Status.Cancelled

    connection.manager.save(request)
    res.send(request)
    return;
})

export default requestController