import AppError from "../../errorHalper.ts/AppError";
import { UserModel } from "./user.model";
import httpStatus from "http-status-codes";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";
import { IAuthProvider, IStatus, IUser, USER_ROLE } from "./user.interface";
import unlinkFile from "../../shared/unLinkFile";
import { QueryBuilder } from "../../utils/QueryBuilder";
// user.service.ts
const createUser = async (payload: any) => {
    const { password, ...rest } = payload
    const userInfo = await UserModel.findOne({ email: payload.email })


    if (userInfo) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists")
    }
    const hashedPassword = await bcrypt.hash(password as string, 10);
    const AuthProvider: IAuthProvider = { provider: "credentials", providerId: payload.email as string }
    const user = await UserModel.create({ ...rest, password: hashedPassword, auths: [AuthProvider] })
    return user;
}

// get All User  --- only admin can access this route
const getAllUser = async (user: JwtPayload, query: any) => {
    if (user.role !== USER_ROLE.ADMIN) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are not authorized")
    }

    const queryBuilder = new QueryBuilder(UserModel.find().lean(), query)
    const result = await queryBuilder
        .search(['name', 'email'])
        .filter()
        .limit()
        .dateRange()
        .sort()
        .fields()
        .paginate()


    const [meta, data] = await Promise.all([
        result.getMeta(),
        result.build()
    ])
    if (!data || data.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, 'No user found');
    }
    return { meta, data }
}


//updateUser
const updateUser = async (payload: any, owner: JwtPayload) => {

    const result = await UserModel.findById({ _id: owner.userId })

    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }

    if (payload.image && result.image) {
        unlinkFile(result.image);
    }

    const updateDoc = await UserModel.findOneAndUpdate({ _id: owner.userId }, payload, {
        new: true,
    });

    return updateDoc
}


// --------------------------- use ID
const userDetails = async (userId: string) => {

    const result = await UserModel.findById({ _id: userId }).select("-password -secretRefreshToken")
    if (!result) {
        throw new AppError(httpStatus.BAD_REQUEST, "User not found")
    }
    return result
}

const deleteUser = async (
    owner: JwtPayload,
    userId?: string,
    password?: string
) => {
    // 👤 USER deletes own account
    if (owner.role === USER_ROLE.USER) {
        if (!password) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                "Password is required to delete your account"
            );
        }

        const user = await UserModel.findById(owner.id).select("password");
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }

        const isMatch = await bcrypt.compare(password as string, user.password as string);
        if (!isMatch) {
            throw new AppError(httpStatus.EXPECTATION_FAILED, "Incorrect password");
        }
        return await userDeleteFunc(owner.id, IStatus.DELETED);
    }

    // 🛡️ ADMIN deletes other user
    if (owner.role === USER_ROLE.ADMIN && userId) {


        const user = await UserModel.findById(userId);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, "User not found");
        }

        if ((owner.role === USER_ROLE.ADMIN) && (user.role === USER_ROLE.ADMIN)) {
            throw new AppError(httpStatus.FORBIDDEN, "Admin Can not delete another admin");
        }

        return await userDeleteFunc(userId, IStatus.SUSPENDED);
    }
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
};

const userDeleteFunc = async (userId: string, status: IStatus) => {
    const updateData: Partial<IUser> = {
        status,
    };

    if (status === IStatus.DELETED) {
        Object.assign(updateData, {
            name: "",
            email: "",
            password: "",
            image: "",
        });
    }

    const result = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
    );

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    return result; // better than null
};


export const userService = {
    createUser,
    getAllUser,
    updateUser,
    userDetails,
    deleteUser,
}
