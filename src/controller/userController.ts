
import { asyncHandler } from "../middleware/asycnHandler";
import {Request,Response,NextFunction} from "express"
import {LoginSchema, RegisterSchema } from "../Validation/authValidation";
import prisma from "../db/dbConnect";
import bcrypt from "bcryptjs"
import generateToken from "../utils/createToken";
import { z } from "zod";
import { User } from "@prisma/client";
interface CustomRequest extends Request {
  user?:any;
}
interface Id extends User{
  id : number
}
export const register = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    try {
    RegisterSchema.parse(req.body)
      const {name,email,password} = req.body;
      
  
      // Check if email exists
      const findUser = await prisma.user.findFirst({
        where: {
          email: email,
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
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password : hashedPassword
        }
      });

     const token = generateToken(res,user.id)
  
      return res.json({
        status: 200,
        message: "User created successfully",
        user,
        token
        
      });
    } catch (error) {
      console.log("The error is", error);
     
        return res.status(500).json("Internal server error");
    
    }
  });

  export const login = asyncHandler(async(req:Request,res:Response)=>{
    try {
      LoginSchema.parse(req.body)
      const {email,password} = req.body;
      const user = await prisma.user.findFirst({
        where : {
          email : email
        }
      })
      if (user) {
        const isPasswordMatch = await bcrypt.compare(password,user.password)
        if (isPasswordMatch) {
          generateToken(res,user.id)
          res.status(200).json({
            message : true,
            user
          })
        }else{
          res.status(400).json({success : false, message : "Invalid user email or password"})
        }

      }else{
        res.status(400).json({success :false, message : "User not found "})
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error")
      
    }
  })

  export const getUsers = asyncHandler(async(req:Request,res:Response)=>{
    try {
      const user = await prisma.user.findMany({})
      res.status(200).json(user)
      
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal server error")
      
    }
  })

  export const getUser = asyncHandler(async(req:CustomRequest,res:Response)=>{
    try {
      const user = await prisma.user.findUnique({where :{
        id : req.user.id
      }})
      if (user) {
        res.status(200).json(user)
      }else{
        res.status(400).json({success:false, message : "User not found"})
      }
    } catch (error) {
      res.status(500).json({message : "Internal server error"})
    }
  })

  export const getUserById = asyncHandler(async(req:Request,res:Response)=>{
    try {
      const user = await prisma.user.findUnique({where : {
        id : Number( req.params.id)
      }})
      if (user) {
        res.status(200).json(user)
      }else{
        res.status(500).json({success : false, message : "Internal server error"})
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({success:false, message : "Internal server error"})
      
    }
  })

  export const deleteUser = asyncHandler(async(req:Request,res:Response)=>{
    try {
      const userDeleted = await prisma.user.delete({
        where : {
          id : Number(req.params.id)
        }
      })
if (userDeleted) {
  res.status(200).json({success : true, message : "User deleted successfully"})
}else{
  res.status(400).json({success : false, message : "User not found"})
}
      
    } catch (error) {
      console.log(error);
      res.status(500).json({message : "Internal server error"})
      
    }
  })

  export const updateUser = asyncHandler(async(req:Request,res:Response)=>{
    
    const {name,email,password} = req.body;
    try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password,salt)
      const updateduser = await prisma.user.update({
        where : {
          id :  Number(req.params.id)
        },
        data : {
          name,
          email,
          password : hashedPassword
        }
      })
      if (updateduser) {
        res.status(200).json({success : true, message : "User updated successfully", updateduser})
      }else{
        res.status(400).json({success : false, message : "User updation failed! try again"})
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({success : false, message : "Internal server error"})
      
    }
  })

  export const updateUserByAdmin = asyncHandler(async(req:Request,res:Response)=>{
    try {
      const {name,email,isAdmin} = req.body
      const user = await prisma.user.update({
        where : {
          id : Number(req.params.id)
        },
        data : {
          name,
          email,
          isAdmin:Boolean(isAdmin)
        }
      })
      res.status(200).json({success : true, message : "User updated", user})
    } catch (error) {
      console.log(error);
      res.status(500).json({success : false, message : "Internal server error"})
      
    }
  })

  export const logout = asyncHandler(async(req:Request, res:Response):Promise<void>=>{
    try {
      res.cookie("jwt", "", {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      })
      res.status(200).json({message : "User logout successfully"})
    } catch (error:any) {
      console.log(error);
      res.status(500).json({success : false, message : "Internal server error"})
    }
  })