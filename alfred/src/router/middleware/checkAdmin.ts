import { Response, Request } from 'express';

export const checkIsAdmin = (req: Request, res: Response, next: any) => {
  if (req.user && !req.user.isAdmin) return res.sendStatus(403);
  next();
  return;
};
