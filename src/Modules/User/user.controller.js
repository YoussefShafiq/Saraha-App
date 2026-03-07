import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { deleteUser, getAllUsers, getUserById, refreshToken, updateUser } from "./user.service.js";
import successResponse from "../../utils//response/successResponse.js";
import { authorization } from "../../Middlewares/auhorization.middleware.js";
import { UserRoles } from "../../utils/enums/user.enum.js";


const userRouter = Router()

userRouter.post('/refresh-token', authentication(true), async (req, res) => {
    const result = refreshToken(req.user)
    return successResponse({ res, data: result, message: 'Token refreshed successfully', statusCode: 200 })
})

userRouter.patch('/update', authentication(), authorization([UserRoles.admin]), async (req, res) => {
    const result = await updateUser(req.user._id, req.body)
    return successResponse({ res, data: result, message: 'user updated successfully', statusCode: 200 })
})

userRouter.delete('/delete', authentication(), async (req, res) => {
    const result = await deleteUser(req.user._id)
    return successResponse({ res, data: result, message: 'user deleted successfully', statusCode: 200 })
})

userRouter.delete('/delete/:id', authentication(), authorization([UserRoles.admin]), async (req, res) => {
    await deleteUser(req.params.id)
    return successResponse({ res, message: 'user deleted successfully', statusCode: 200 })
})

userRouter.get('/profile', authentication(), async (req, res) => {
    const result = await getUserById(req.user._id)
    return successResponse({ res, data: result, message: 'current user retrieved successfully', statusCode: 200 })
})

userRouter.get('/all-users', authentication(), authorization([UserRoles.admin]), async (req, res) => {
    const result = await getAllUsers()
    return successResponse({ res, data: result, message: 'all users retrieved successfully', statusCode: 200 })
})

export default userRouter