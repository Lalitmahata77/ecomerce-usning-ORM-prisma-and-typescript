import {z} from "zod"

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