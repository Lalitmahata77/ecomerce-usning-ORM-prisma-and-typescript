import vine from "@vinejs/vine";
import { asyncHandler } from "../middleware/asycnHandler";
import {Request,Response,NextFunction} from "express"
import { registerSchema } from "../Validation/authValidation";
import prisma from "../db/dbConnect";
import bcrypt from "bcryptjs"
import { errors } from "@vinejs/vine";
export const register = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    try {
      // const vine = await import('@vinejs/vine');
      // const errors = await import('@vinejs/errors');
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);
  
      // Check if email exists
      const findUser = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
  
      if (findUser) {
        return res.status(400).json({
          errors: {
            email: "Email already taken. Please use another one.",
          },
        });
      }
  
      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
  
      const user = await prisma.user.create({
        data: payload,
      });
  
      return res.json({
        status: 200,
        message: "User created successfully",
        user,
      });
    } catch (error) {
      console.log("The error is", error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ errors: error.messages });
      } else {
        return res.status(500).json({
          status: 500,
          message: "Something went wrong. Please try again.",
        });
      }
    }
  });