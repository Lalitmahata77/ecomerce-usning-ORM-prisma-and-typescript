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
  orderItems: z.array(
    z.object({
      name: z.string(),
      qty: z.number().nonnegative(), // Ensure quantity is non-negative
      image: z.string(),
      price: z.number().nonnegative(), // Ensure price is non-negative
      product: z.string(),
      id: z.number().int(), // Ensure ID is an integer
    })
  ),
  shippingAddress: z.object({
    address: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(), // Fixed typo
  }),
  paymentMethod: z.enum(["Credit Card", "PayPal", "Stripe"]), // Restrict payment methods
  itemsPrice: z.number().nonnegative(),
  shippingPrice: z.number().nonnegative(),
  taxPrice: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  isPaid: z.boolean().default(false), // Default to false
  paidAt: z.string().datetime().optional(), // Optional ISO date
  isDelivered: z.boolean().default(false), // Default to false
  deliveredAt: z.string().datetime().optional(), // Optional ISO date
  paymentResult: z
    .object({
      paymentId: z.number().int(),
      status: z.string(),
      updateTime: z.string().datetime(), // ISO date validation
      emailAddress: z.string().email(), // Validate email format
    })
    .optional(), // Optional for initial order creation
    id : z.number().int()
});


export const markOrderAsPaidSchema = z.object({
  id : z.number().int(),
  paymentResult: z
  .object({
    paymentId: z.string(),
    status: z.string(),
    updateTime: z.string().datetime(), // ISO date validation
    emailAddress: z.string().email(), // Validate email format
  })
  .optional(), // Optional for initial order creation
  paidAt : z.string().datetime(),
  isPaid : z.boolean().default(false)
})