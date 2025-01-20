import { asyncHandler } from "../middleware/asycnHandler";
import {Request,Response} from "express"
import { CategorySchema } from "../Validation/authValidation";
import prisma from "../db/dbConnect";

export const createCategory = asyncHandler(async(req:Request, res:Response)=>{
    try {
        CategorySchema.parse(req.body)
        const {name} = req.body;
        const category = await prisma.category.findFirst({
            where : {
            name : name
            }
        })
        if (category) {
          return  res.status(400).json({success : false, message : "Category already exist"})
        }

        const newCategory = await prisma.category.create({
            data : {
                name : name
            }
        })
        if (newCategory) {
            res.status(200).json({success : true, newCategory})
        }else{
            res.status(400).json({success : false, message : "Category creation failed! try again"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message : "Internal server error"})
        
    }
})

export const getCategory = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const category = await prisma.category.findUnique({
            where : {
                id : Number(req.params.id)
            }
        })
        if (category) {
            res.status(200).json(category)
        }else{
            res.status(400).json({success:false, message : "Category not found"})
        }
    } catch (error) {
        res.status(500).json({success : false, message : "Internal server error"})
    }
})

export const categories = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const category = await prisma.category.findMany({})
        res.status(200).json(category)
        
    } catch (error) {
        res.status(500).json({message : "Internal server error"})
    }
})

export const deleteCategory = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const category = await prisma.category.delete({
            where : {
                id : Number(req.params.id)
            }
        })
        if (category) {
            res.status(200).json({success : true, message : "Category deleted successfully"})
        }else{
            res.status(400).json({success:false, message : "Category not found"})
        }
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({message : "Internal server error"})
    }
})

export const updateCategory = asyncHandler(async(req:Request,res:Response)=>{
    CategorySchema.parse(req.body)
    const {name} = req.body
    try {
        const category = await prisma.category.update({
            where : {
                id : Number(req.params.id)
            },
            data : {name:name}
        })
        if (category) {
            res.status(200).json({success:true, category})
        }else{
            res.status(400).json({success:false, message : "Category not found"})
        }

    } catch (error) {
        console.log(error);
        
        res.status(500).json({message : "Internal server error"})

    }
})