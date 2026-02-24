import { model, Schema } from "mongoose";
import { USER_ROLE, IStatus, IUser, IAuthProvider } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
})

// user.model.ts
export const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true, },
    role: { type: String, enum: Object.values(USER_ROLE), default: USER_ROLE.USER, },
    image: { type: String, },
    phoneNumber: { type: String, },
    personalInfo: {
        address: { type: String, },
        city: { type: String, },
        country: { type: String, },
        zipCode: { type: String, },
    },
    dateOfBirth: { type: Date, },
    secretRefreshToken: { type: [String], default: [] },
    auths: [authProviderSchema],
    verified: { type: Boolean, default: false, },
    status: { type: String, enum: Object.values(IStatus), default: IStatus.PENDING, },
    isVibrationNotificationEnabled: { type: Boolean, default: true, },
    isSoundNotificationEnabled: { type: Boolean, default: true, },
    fcmToken: { type: String, },

    // Payment ----------💸💸💸
    stripeAccountInfo: {
        stripeAccountId: { type: String, },
    },
    stripeConnectedAccount: { type: String, },
    isCompleted: { type: Boolean, default: false, },
    lastActiveAt: {
        type: Date,
        default: Date.now,
    }
})


export const UserModel = model<IUser>('User', UserSchema);