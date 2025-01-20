import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {asyncHandler} from './asycnHandler';
import prisma from '../db/dbConnect';
import { any } from 'zod';

interface DecodedToken {
  userId: number;
}

interface CustomRequest extends Request {
  user?: any;
}
export const isAuthenticate = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;
  token = req.cookies.jwt;
// console.log(token);

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

export const isAdmin = asyncHandler(async(req:CustomRequest,res:Response,next:NextFunction)=>{
  if (req.user && req.user.isAdmin) {
    next()
  }else {
    res.status(401).send("Not authorized as an admin.");
  }

})