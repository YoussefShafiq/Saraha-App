import { Router } from "express";
import { verifyToken } from "../../Middlewares/auth.middleware.js";
import { deleteUser, getUserById, updateUser } from "./user.service.js";
import successResponse from "../../utils//response/successResponse.js";


const userRouter = Router()

userRouter.patch('/update', verifyToken, async (req, res) => {
    const result = await updateUser(req.id, req.body)
    return successResponse({ res, data: result, message: 'user updated successfully', statusCode: 200 })
})

userRouter.delete('/delete', verifyToken, async (req, res) => {
    const result = await deleteUser(req.id)
    return successResponse({ res, data: result, message: 'user deleted successfully', statusCode: 200 })
})

userRouter.get('/profile', verifyToken, async (req, res) => {
    const result = await getUserById(req.id)
    return successResponse({ res, data: result, message: 'current user retrieved successfully', statusCode: 200 })
})

export default userRouter