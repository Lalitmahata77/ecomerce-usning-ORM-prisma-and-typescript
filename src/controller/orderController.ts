import { asyncHandler } from "../middleware/asycnHandler";
import {Request,Response} from "express"
import { OrderSchema } from "../Validation/authValidation";
import prisma from "../db/dbConnect";
import { connect } from "http2";



interface OrderItem {
    id: number;
    price: number;
    qty: number;
  }
  
  interface CalculatedPrices {
    itemsPrice: number;
    shippingPrice: number;
    taxPrice: number;
    totalPrice: number;
  }
  
  function calcPrices(
    orderItems: OrderItem[], 
    taxRate: number = 0.15, 
    freeShippingThreshold: number = 100, 
    shippingFee: number = 10
  ): CalculatedPrices {
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return {
        itemsPrice: 0.00,
        shippingPrice: 0.00,
        taxPrice: 0.00,
        totalPrice: 0.00,
      };
    }
  
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
  
    const shippingPrice = itemsPrice > freeShippingThreshold ? 0 : shippingFee;
    const taxPrice = itemsPrice * taxRate;
  
    const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
    return {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    };
  }
  
export const createOrder = asyncHandler(async(req:Request,res:Response)=>{
try {
    const payload = OrderSchema.parse(req.body)
    // const {orderItems, shippingAddress, paymentMethod} = req.body;
    if (Array.isArray(payload.orderItems) && payload.orderItems.length === 0) {
        res.status(400)
        throw new Error("No order items")
    }
    const user = await prisma.user.findUnique({
      where : {
          id : Number(req.params.id)
      }
  })
    // const orderItemsFromDB = await prisma.orderItems.findMany({
    //   where: {
    //     id: Number(req.params.id)
    //   }
    // });


    const itemsFromDB = await Promise.all(
        payload.orderItems.map(async(item )=>{
         
            const product = await prisma.product.findUnique({
                where : {
                    id : item.id
                }
            })
            if (!product) {
                res.status(404)
                throw new Error(`Product not found with id ${item.id}`)
            }
            return {
                ...item,
                id: item.id, // Ensure the id is included
                name : product.name,
                image : product.image,
                price : product.price,
                product : product.id,
            }
            
        })
    )
    const {itemsPrice, shippingPrice, taxPrice, totalPrice} = calcPrices(itemsFromDB)
    const order = await prisma.order.create({
      data : {
        orderItems : {
          createMany : {
            data : {
              orderItems : itemsFromDB,
              product : {
                connect : {
                  id : itemsFromDB[0].id
                }
              }
            }
          }
        },
        user : {
          connect : {
            id : user?.id
          }
        },
        shippingAddress : {
          create : {
            address : payload.shippingAddress.address,
            city : payload.shippingAddress.city,
            postalCode : payload.shippingAddress.postalCode,
            country : payload.shippingAddress.counrty,
          }
        },
        paymentMethod : payload.paymentMethod,
        itemsPrice : itemsPrice,
        shippingPrice : shippingPrice,
        taxPrice : taxPrice,
        totalPrice : totalPrice,
        paymentResult : {
          create : {
            paymentId  : payload.paymentResult.paymentId,
            status : payload.paymentResult.status,
            updateTime : payload.paymentResult.updateTime,
            emailAddress : payload.paymentResult.emailAddress
          }
        }

      }
    })
    res.status(201).json(order)
    
} catch (error) {
    console.log(error);
    res.status(500).json({message : "Internal server error"})
    
}
})