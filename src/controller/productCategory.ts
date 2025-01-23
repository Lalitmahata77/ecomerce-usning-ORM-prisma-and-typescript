import {Request,Response} from "express"
import { asyncHandler } from "../middleware/asycnHandler"
import { ProductSchema, ReviewSchema, UpdateProductSchema } from "../Validation/authValidation";
import prisma from "../db/dbConnect";
interface FilterProductsRequestBody {
    checked: string[];
    radio: number[];
}
export const createProduct = asyncHandler(async(req:Request,res:Response)=>{
    try {
        ProductSchema.parse(req.body)
        const {name,price,description,category,brand,rating,numberOfReviews,image,countInStock,quantity} = req.body;
        switch (true){
            case !name:
                return res.status(400).json({success :false, message : "Name is required"})
                case !price:
                    return res.status(400).json({success:false, message : "Price is required"})
                    case !description:
                        return res.status(400).json({success:false, message : "Description is required"})
                       
                               case !category:
                                return res.status(400).json({success:false, message:"Category is required"})
                                case !brand:
                                   return res.status(400).json({success:false, message : "Brand is required"})
                                                             
        }
        const product = await prisma.product.findFirst({
            where : {
// id :Number(req.params.id)
name:name
            }
        })
        if (product) {
            return res.status(400).json({success:false,  message : "Product already exist"})
        }

      

        const newProduct = await prisma.product.create({
            data : {
                name,category: {
                    connect : {
                        id : category.id
                    }
                },price,description,brand,rating,numberOfReviews,image,countInStock,quantity
               
            }
        })
        res.status(201).json({success:true, newProduct})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message : "Internal server error"})
        
    }
})


export const getProducts = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const products = await prisma.product.findMany({include : {reviews : true,category:true}})
        res.status(200).json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal server error"})
        
    }
})

export const getProduct = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const product = await prisma.product.findUnique({
            where : {
                id : Number(req.params.id)
            },
            include : {
                reviews : true
            }
        })
        if (!product) {
         return   res.status(404).json({success:false, message:"Product not found"})
        }
        res.status(200).json(product)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"Internal server error"})
        
    }
})

export const updateProduct = asyncHandler(async(req:Request,res:Response)=>{
    try {
        UpdateProductSchema.parse(req.body)
        const {name,price,description,category,brand,rating,numberOfReviews,image,countInStock,quantity} = req.body;

        const product = await prisma.product.findUnique({
            where : {
                id : Number(req.params.id)
            }
        })
        if (!product) {
            return res.status(404).json({success:false, message : "Product not found"})
        }
        const updatedProduct = await prisma.product.update({
            where : {
                id : Number(req.params.id)
            },
            data : {
                name,category: {
                    connect : {
                        id : category.id
                    }
                },price,description,brand,rating,numberOfReviews,image,countInStock,quantity
               
            }
        })
        res.status(200).json({success:true, updatedProduct})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message : "Internal server error"})
        
    }
})


export const deleteProduct = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const product = await prisma.product.findUnique({
            where : {
                id : Number(req.params.id)
            }
        })
        if (!product) {
            return res.status(404).json({success:false, message : "Product not found"})
        }
        await prisma.product.delete({
            where : {
                id : Number(req.params.id)
            }
        })
        res.status(200).json({success:true, message : 'Product deleted'})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message : "Internal server error"})
        
    }
})

export const createProductReview = asyncHandler(async(req:Request,res:Response)=>{
    try {
      const payload =  ReviewSchema.parse(req.body)
        // const {rating, comment} = req.body
        const user = await prisma.user.findUnique({
            where : {
                id : Number(req.params.id)
            }
        })
        const product = await prisma.product.findUnique({
            where : {
                id :Number(req.params.id)
            }
        })
        if (product) {
            const alreadyReviewed = await prisma.product.findFirst({
where : {
    reviews : {
        some : {
            name : user?.name,
            product : {
                id : product.id
            }
           
        }
    }
}        })

if (alreadyReviewed) {
  return  res.status(400).json({success:false, message : "Product already reviewed"})
}

// const review = {
//     name : user?.name,
//     rating :rating,
//     comment,
//     // postId : product.id,
//     user : {
//         connect : {
//             id : user?.id
//         }
//     }
// }
const reviewed = await prisma.review.create({
    data : {
        name:payload.name,
        rating : payload.rating,
        comment : payload.comment,
        user : {
            connect : {
                id : user?.id
            }
        },
        product : {
            connect : {
                id : product.id
            }
        }
    },
   
})

res.status(201).json({success:true, reviewed})
        }else{
            res.status(404).json({success:false, message : "Product not found."})
        }
       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message : "Internal server error"})
        
    }
})


export const getTopProducts = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const products = await prisma.product.findMany({
            orderBy : {
                rating : "desc"
            }
        })
        res.status(200).json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message : "Internal server error"})
        
    }
})
export const newProducts = asyncHandler(async(req:Request,res:Response)=>{
    try {
        const products = await prisma.product.findMany({
            orderBy : {
                createdAt : "desc"
            }
        })
        res.status(200).json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message : "Internal server error"})
        
    }
})

// export const filterProducts = asyncHandler(async(req:Request,res:Response)=>{
//     try {
//         const {name} = req.query
//         const products = await prisma.product.findMany({
//             where : {
//                 name : {
//                     contains : name,
//                     mode : "insensitive"

//                 }
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({success:false, message : "Internal server error"})
        
//     }
// })

// export const filterProducts = asyncHandler(async (req:Request, res:Response) => {
//     try {
//       const { checked, radio } = req.body;
  
//       let args = {};
//       if (checked.length > 0) args.calls = checked;
//       if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
  
//       const products = await Product.find(args);
//       res.json(products);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Server Error" });
//     }
//   });


export const filterProducts = asyncHandler(
    async (req: Request<{}, {}, FilterProductsRequestBody>, res: Response) => {
        try {
            const { checked = [], radio = [] } = req.body;

            // Validate 'checked' and 'radio'
            if (!Array.isArray(checked)) {
                return res.status(400).json({ error: "Invalid 'checked' parameter" });
            }
            if (!Array.isArray(radio) || radio.length !== 2 || radio.some(isNaN)) {
                return res.status(400).json({ error: "Invalid 'radio' parameter" });
            }

            if (!checked.length && !radio.length) {
                return res.status(400).json({ error: "No filters provided" });
            }

            // Build query arguments
            const args: { [key: string] : any} = {};         
               if (checked.length) args.category = {$in : checked  };
            if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

            // Query the database
            const products = await prisma.product.findMany({
                where: args
            });

            // Return response
            res.json({
                success: true,
                count: products.length,
                products,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);