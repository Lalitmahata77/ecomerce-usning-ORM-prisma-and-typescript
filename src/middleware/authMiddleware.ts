import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {asyncHandler} from './asycnHandler';
import prisma from '../db/dbConnect';

interface DecodedToken {
  userId: string;
}

export const isAuthenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  token = req.cookies.Jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      req.user = await prisma.user.findFirst({ where: { id : decoded.userId } });
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, token not found");
  }
});