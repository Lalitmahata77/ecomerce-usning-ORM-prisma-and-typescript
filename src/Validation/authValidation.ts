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