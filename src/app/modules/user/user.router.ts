import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { USER_ROLE } from "./user.interface";
import fileUploadHandler from "../../middleware/fileUploadHandlare";
import { parseFormDataMiddleware } from "../../middleware/parseFromData";



// user.router.ts
const router = Router()
const allUser = [USER_ROLE.ADMIN, USER_ROLE.USER]
router.route("/")   //create update getAll
    .get(checkAuth(USER_ROLE.ADMIN), userController.getAllUser)
    .patch(checkAuth(...allUser), fileUploadHandler(), parseFormDataMiddleware, userController.updateUser)
    .post(fileUploadHandler(), parseFormDataMiddleware, userController.createUser)


router.route("/:id")
    .get(checkAuth(USER_ROLE.ADMIN, USER_ROLE.USER), userController.userDetails)
// Delete User (ADMIN CAN delete any user )
router.route("/delete").delete(checkAuth(USER_ROLE.ADMIN, USER_ROLE.USER), userController.deleteUser)

export const userRouter = router