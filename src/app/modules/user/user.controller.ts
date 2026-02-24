import { NextFunction, Request, Response } from "express"
import { userService } from "./user.service"
import catchAsync from "../../utils/catchAsync"
import { JwtPayload } from "jsonwebtoken"


// user.controller.ts
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `image/${req.files.image[0].filename}`
    }

    const result = await userService.createUser(req.body)

    res.status(200).json({
        success: true,
        message: "User created successfully",
        data: null
    })
})

// getAllUser  -----  ONLY ADMIN can access this route
const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as JwtPayload
    const query = req.query;
    const result = await userService.getAllUser(user, query)
    res.status(200).json({
        success: true,
        message: "User created successfully",
        data: { ...result }
    })
})


//updateUser 
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.files && "image" in req.files && req.files.image) {
        req.body.image = `image/${req.files.image[0].filename}`
    }
    const owner = req.user as JwtPayload
    const result = await userService.updateUser(req.body, owner)
    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result
    })
})



// -------------------------------- use ID   ---------------
const userDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const owner = req.user as JwtPayload
    const userId = req.params.id as string
    const result = await userService.userDetails(userId)
    res.status(200).json({
        success: true,
        message: "User get successfully",
        data: result
    })
})


const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const owner = req.user as JwtPayload
    const { userId } = req.query
    const { password } = req.body
    const result = await userService.deleteUser(owner, userId as string, password as string)
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result
    })
})
export const userController = {
    createUser,
    getAllUser,
    updateUser,
    userDetails,
    deleteUser
}