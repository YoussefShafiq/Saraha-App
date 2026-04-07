import { Router } from "express";
import { authentication } from "../../Middlewares/authentication.middleware.js";
import { deleteMessage, getAllMessages, getMessageById, getMessagesBetweenTwoUsers, getMessagesSentByMe, getMessagesSentToMe, sendMessage } from "./message.service.js";
import successResponse from "../../utils/response/successResponse.js";
import uploadLocal from "../../utils/Multer/multer.config.js";

const messageRouter = Router()

messageRouter.post('/:recieverId',
    (req, res, next) => {
        if (!req.headers.authorization) return next();
        return authentication()(req, res, next)
    },
    uploadLocal('messages attachments').array('attachments'),
    async (req, res, next) => {
        try {
            const result = await sendMessage(req.body.content, req.params.recieverId, req.user?._id, req.files)
            return successResponse({ res, data: result, message: 'message sent successfully', statusCode: 200 })
        } catch (err) {
            return next(err)
        }
    }
)

messageRouter.get('/all-messages', authentication(), async (req, res) => {
    const result = await getAllMessages(req.user?._id)
    return successResponse({ res, data: result, message: 'all messages retrieved successfully', statusCode: 200 })
})

messageRouter.get('/messages-sent-to-me', authentication(), async (req, res) => {
    const result = await getMessagesSentToMe(req.user?._id)
    return successResponse({ res, data: result, message: 'messages sent to me retrieved successfully', statusCode: 200 })
})

messageRouter.get('/messages-sent-by-me', authentication(), async (req, res) => {
    const result = await getMessagesSentByMe(req.user?._id)
    return successResponse({ res, data: result, message: 'messages sent by me retrieved successfully', statusCode: 200 })
})

messageRouter.get('/messages-between-two-users/:userId1', authentication(), async (req, res) => {
    const result = await getMessagesBetweenTwoUsers(req.params.userId1, req.user?._id)
    return successResponse({ res, data: result, message: 'messages between two users retrieved successfully', statusCode: 200 })
})

messageRouter.get('/message/:messageId', authentication(), async (req, res) => {
    const result = await getMessageById(req.params.messageId, req.user?._id)
    return successResponse({ res, data: result, message: 'message retrieved successfully', statusCode: 200 })
})

messageRouter.delete('/message/:messageId', authentication(), async (req, res) => {
    await deleteMessage(req.params.messageId, req.user?._id)
    return successResponse({ res, message: 'message deleted successfully', statusCode: 200 })
})

export default messageRouter