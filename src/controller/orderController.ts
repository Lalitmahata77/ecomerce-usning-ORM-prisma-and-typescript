import { asyncHandler } from "../middleware/asycnHandler";
import {Request,Response} from "express"
import { markOrderAsPaidSchema, OrderSchema } from "../Validation/authValidation";
import prisma from "../db/dbConnect";

// Utility function to calculate prices
const calcPrices = (items: any[]) => {
  const itemsPrice = items.reduce((acc, item) => acc + item.qty * item.price, 0);
  const taxPrice = itemsPrice * 0.1; // Example: 10% tax
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: Free shipping for orders > $100
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};

export const createOrder = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request payload
    const payload = OrderSchema.parse(req.body);

    if (Array.isArray(payload.orderItems) && payload.orderItems.length === 0) {
      res.status(400).json({ message: "No order items" });
      return;
    }

   
    
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    

    // Validate and enrich order items
    const itemsFromDB = await Promise.all(
      payload.orderItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.id },
        });

        if (!product) {
          res.status(404).json({ message: `Product not found with id ${item.id}` });
          throw new Error(`Product not found with id ${item.id}`);
        }

        return {
          ...item,
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
        };
      })
    );

    // Calculate prices
    const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calcPrices(itemsFromDB);

    // Create the order
    const order = await prisma.order.create({
      data: {
        orderItems: {
          createMany: {
            data: itemsFromDB.map((item) => ({
              product_id: item.id,
              name: item.name,
              image: item.image,
              qty: item.qty,
              price: item.price,
            })),
          },
        },
        user: {
          connect: { id: user.id },
        },
        shippingAddress: {
          create: payload.shippingAddress,
        },
        paymentMethod: payload.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentResult: payload.paymentResult
          ? {
              create: {
                paymentId: payload.paymentResult.paymentId,
                status: payload.paymentResult.status,
                updateTime: payload.paymentResult.updateTime,
                emailAddress: payload.paymentResult.emailAddress,
              },
            }
          : { create: {} },
      },
    });

    // Respond with created order
    res.status(201).json(order);
  } catch (error: any) {
    console.error(error.message);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});


export const orders = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const order = await prisma.order.findMany({
      include : {
        user : true
      }
    })
    res.status(200).json(order)
    
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
    
  }
})

export const userOrders = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const orders = await prisma.order.findMany({where : {user_id : Number(req.params.id)}})
    res.status(200).json(orders)
    
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
  }
})

export const countTotalOrders = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const countOrder = await prisma.order.count()
    res.status(200).json(countOrder)
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
  }
})

export const calculateTotalSales = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const orders = await prisma.order.findMany()
    // console.log(orders);
    
     const totalSales = orders.reduce((sum,acc)=> sum + acc.totalPrice,0)
     res.json({totalSales})
    
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
  }
  }
)

export const calcualteTotalSalesByDate = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const salesByDate = await prisma.order.findMany({
      where : {
        createdAt : {
          gte : new Date(req.params.startDate),
          lte : new Date(req.params.endDate)
        }
      }
      
    })
    res.status(200).json(salesByDate)
    
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
  }
})

export const findOrderById = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) }
    })
    res.status(200).json(order)
    
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
  }
})

export const markOrderAsPaid = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const payload = markOrderAsPaidSchema.parse(req.body)
    const order = await prisma.order.findUnique({
      where : {
        id : payload.id
      }
    })
    if (order) {
      order.isPaid = true
      order.paidAt = new Date()
      order.paymentResult_id
      res.status(200).json(order)
    }else{
      res.status(400).json({message : "Order not found"})
    }
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
  }
})

export const markAsDelivered = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
  try {
    const order = await prisma.order.findUnique({
      where : {
        id : Number(req.params.id)
      }
    })
    if (order) {
      order.isDelivered = true
      order.deliveredAt = new Date()
    }
  } catch (error:any) {
    console.log(error);
    if (error.name === "ZodError") {
      res.status(400).json({ message: "Validation Error", errors: error.errors });

    }else{
      res.status(500).json({message : "Internal server error"})
    }
  }
})