import { Router } from "express";
import { userRouter } from "../modules/user/user.router";
import { authRouter } from "../modules/auth/auth.router";

const router = Router();


const apiRoutes = [
    {
        path: "/user",
        router: userRouter
    },
    {
        path: "/auth",
        router: authRouter
    }
]




apiRoutes.forEach((route) => {
    router.use(route.path, route.router)
})

export default router;