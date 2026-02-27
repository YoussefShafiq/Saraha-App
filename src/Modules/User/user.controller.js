import { Router } from "express";
import { verifyToken } from "../../Middlewares/auth.middleware.js";
import { deleteUser, getUserById, refreshToken, updateUser } from "./user.service.js";
import successResponse from "../../utils//response/successResponse.js";


const userRouter = Router()

userRouter.post('/refresh-token', verifyToken(true), async (req, res) => {
    const result = refreshToken(req.user)
    return successResponse({ res, data: result, message: 'Token refreshed successfully', statusCode: 200 })
})

userRouter.patch('/update', verifyToken(), async (req, res) => {
    const result = await updateUser(req.user._id, req.body)
    return successResponse({ res, data: result, message: 'user updated successfully', statusCode: 200 })
})

userRouter.delete('/delete', verifyToken(), async (req, res) => {
    const result = await deleteUser(req.user._id)
    return successResponse({ res, data: result, message: 'user deleted successfully', statusCode: 200 })
})

userRouter.get('/profile', verifyToken(), async (req, res) => {
    console.log('profile');

    const result = await getUserById(req.user._id)
    return successResponse({ res, data: result, message: 'current user retrieved successfully', statusCode: 200 })
})

export default userRouter