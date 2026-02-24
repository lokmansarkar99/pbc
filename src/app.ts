import cors from 'cors';
import express from "express"
import { globalErrorHandlare } from "./app/middleware/globalErrorHandlare";
import { notFound } from "./app/middleware/notFound";
import router from "./app/Router/router";
import webhookHandler from './app/modules/stripe/webhookHandler';
import { UserModel } from './app/modules/user/user.model';


const app = express()
// ✅ STRIPE WEBHOOK MUST BE **BEFORE** express.json()
app.post(
    '/api/v1/stripe/webhook',
    express.raw({ type: 'application/json' }),
    webhookHandler
);



app.use(cors())
app.use(express.json())
app.use("/api/v1", router);
app.use('/uploads', express.static('uploads'));

app.use(async (req, res, next) => {
    const userId = req.user?.userId;
    if (userId) {
        await UserModel.findByIdAndUpdate(userId, {
            lastActiveAt: new Date(),
        });
    }
    next();
});


app.get("/", (req, res) => {
    const date = new Date(Date.now());
    res.send(
        `
       <h1 style="text-align:center; color:#4CAF50; width: 70%; margin: auto; font-family:Verdana, sans-serif; font-size:3rem; text-transform:uppercase; text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1); margin-top: 20px;">
    Beep-boop! Server's awake and ready to serve!
</h1>
<p style="text-align:center; color:#FF5722; font-family:Verdana, sans-serif; font-size:1.25rem; font-weight:bold; margin-top: 10px;">
    ${date}
</p>
`
    );
})

app.use(globalErrorHandlare)
app.use(notFound)

export default app;