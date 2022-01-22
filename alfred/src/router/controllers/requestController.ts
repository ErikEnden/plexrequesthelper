import { verifyToken } from '../utilities/tokenFactory';
import { Request, Response } from 'express';
import { MediaRequest } from '../../entities/MediaRequest';
import { getConnection } from 'typeorm';
import { User } from '../../entities/User';
import { DateTime } from 'luxon';
import Status from '../types/status';
import express = require('express');

const requestController = express.Router();

const createRequest = (req: Request, user: User) => {
  const request = new MediaRequest();
  request.tmdb_id = req.body.target.id;
  request.title = req.body.target.title;
  request.release_date = req.body.target.release_date;
  request.poster_url = req.body.poster_url;
  request.created_at = DateTime.now().toUTC().toISO();
  request.requester = user;
  request.notes = req.body.notes;
  request.status = Status.Requested;

  return request;
};

requestController.get(
  '/list',
  [verifyToken],
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(400);

    const connection = await getConnection();
    let data = null;
    if (!req.user.isAdmin) {
      const user = await connection.manager.findOne(User, {
        id: req.user.id
      });
      if (!user) return res.sendStatus(400);
      data = await connection.manager
        .getRepository(MediaRequest)
        .createQueryBuilder('mediarequest')
        .where('mediarequest.requester = :user', { user: user.id })
        .getMany();
      if (!data || data.length === 0) return res.sendStatus(204);
      return res.send({ results: data });
    } else {
      data = await connection.manager
        .getRepository(MediaRequest)
        .createQueryBuilder('mediarequest')
        .innerJoin('mediarequest.requester', 'requester')
        .addSelect(['requester.id', 'requester.name'])
        .getMany();

      data = data.sort((a, b) => {
        const d1 = DateTime.fromISO(a.created_at).toMillis();
        const d2 = DateTime.fromISO(b.created_at).toMillis();
        return d2 - d1;
      });
      return res.send({ results: data });
    }
  }
);

requestController.post(
  '/new',
  [verifyToken],
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(401);
    if (!req.body.target) return res.sendStatus(400);

    const connection = getConnection();
    const user = await connection.manager.findOne(User, { id: req.user.id });
    if (!user) return res.sendStatus(400);

    const request = await createRequest(req, user);
    await connection.manager.save(request).catch(() => {
      return res.sendStatus(500);
    });
    return res.sendStatus(201);
  }
);

requestController.patch(
  '/accept/:requestId',
  [verifyToken],
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();
    const request = await connection.manager.findOne(MediaRequest, {
      id: parseInt(req.params.requestId)
    });

    if (!request) return res.sendStatus(500);
    request.status = Status.Accepted;

    await connection.manager.save(request);
    return res.send(request);
  }
);
requestController.patch(
  '/reject/:requestId',
  [verifyToken],
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();
    const request = await connection.manager.findOne(MediaRequest, {
      id: parseInt(req.params.requestId)
    });

    if (!request) return res.sendStatus(500);
    request.status = Status.Rejected;

    await connection.manager.save(request);
    return res.send(request);
  }
);

requestController.patch(
  '/fulfill/:requestId',
  [verifyToken],
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();
    const request = await connection.manager.findOne(MediaRequest, {
      id: parseInt(req.params.requestId)
    });

    if (!request) return res.sendStatus(500);
    request.status = Status.Fulfilled;

    await connection.manager.save(request);
    return res.send(request);
  }
);

requestController.patch(
  '/cancel/:requestId',
  [verifyToken],
  async (req: Request, res: Response) => {
    if (!req.user) return res.sendStatus(400);
    if (!req.user.isAdmin) return res.sendStatus(401);

    const connection = await getConnection();
    const request = await connection.manager.findOne(MediaRequest, {
      id: parseInt(req.params.requestId)
    });

    if (!request) return res.sendStatus(500);
    request.status = Status.Cancelled;

    await connection.manager.save(request);
    return res.send(request);
  }
);

requestController.get(
  '/existing',
  verifyToken,
  async (req: Request, res: Response) => {
    const connection = await getConnection();
    if (!req.user) return res.sendStatus(401);
    const data = await connection
      .createQueryBuilder(MediaRequest, 'mediarequest')
      .select('mediarequest.tmdb_id')
      .getMany();

    return res.send({ existing_requests: data });
  }
);

export default requestController;
