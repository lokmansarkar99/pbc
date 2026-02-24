// user.validation.ts
import { z } from "zod";

const createUser = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["ADMIN", "USER"]),
    image: z.string().optional(),
    phoneNumber: z.string().optional(),
    personalInfo: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        zipCode: z.string().optional(),
    }),
    dateOfBirth: z.date().optional(),
    verified: z.boolean().optional().default(false),
});


const updateUser = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["ADMIN", "USER"]),
    image: z.string().optional(),
    phoneNumber: z.string().optional(),
    personalInfo: z.object({
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        zipCode: z.string().optional(),
    }),
    dateOfBirth: z.date().optional(),
    verified: z.boolean().optional().default(false),
})

export const userValidation = {
    createUser,
    updateUser
}