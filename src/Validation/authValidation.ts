import {z, ZodString} from "zod"

export const RegisterSchema = z.object({
  name : z.string(),
  email : z.string().email(),
  password : z.string().min(5)
})

export const LoginSchema = z.object({
  email : z.string().email(),
  password : z.string().min(5)
})

export const CategorySchema = z.object({
  name : z.string()
})

export const ProductSchema = z.object({
  name : z.string(),
  price : z.number(),
  description : z.string(),
  countInStock : z.number(),
  // category : z.string(),
  brand : z.string(),
  image : z.string(),
  rating : z.number(),
  numberOfReviews : z.number()

})
export const UpdateProductSchema = z.object({
  name : z.string(),
  price : z.number(),
  description : z.string(),
  countInStock : z.number(),
  // category : z.string(),
  brand : z.string(),
  image : z.string(),
  rating : z.number(),
  numberOfReviews : z.number()
})

export const ReviewSchema = z.object({
  rating : z.number(),
  comment : z.string(),
  name : z.string(),
  // id : z.number()
})

export const updateCategorySchema = z.object({
  name : z.string()
})

export const OrderSchema = z.object({
  orderItems : z.array(z.object({
    name : z.string(),
    qty : z.number(),
    image : z.string(),
    price : z.number(),
    product : z.string(),
    // id : z.number()
  })),
  shippingAddress : z.object({
    address : z.string(),
    city : z.string(),
    postalCode : z.string(),
    counrty : z.string(),
  }),
  paymentMethod : z.string(),
  itemsPrice : z.number(),
  shippingPrice : z.number(),
  taxPrice : z.number(),
  totalPrice : z.number(),
  isPaid : z.boolean(),
  paidAt : z.string(),
  isDelivered : z.boolean(),
  deliveredAt : z.string(),
  // user : z.string(),
  paymentResult : z.object({
    paymentId : z.string(),
    status : z.string(),
    updateTime : z.string(),
    emailAddress : z.string()
  })

})