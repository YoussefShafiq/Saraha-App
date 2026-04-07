import messageModel from "../../DB/Models/message.model.js";
import userModel from "../../DB/Models/user.model.js";
import { deleteOne } from "../../DB/Repository/delete.repo.js";
import { find, findById } from "../../DB/Repository/get.repo.js";
import { insertOne } from "../../DB/Repository/insert.repo.js";
import { badRequestException, notAuthorizedException, notFoundException } from "../../utils/response/failResponse.js";

export async function sendMessage(content, receiver, sender, attachments = []) {
    const user = await findById(userModel, receiver)

    if (!user) {
        notFoundException('reciever not found')
    }

    if (sender == receiver) {
        badRequestException('you cannot send a message to yourself')
    }

    if (!attachments.length && !content) {
        badRequestException('content or attachments are required')
    }

    const attachmentsPaths = attachments.map(attachment => attachment.finalDist)

    const newMessage = await insertOne(messageModel, { content, receiver, sender, attachments: attachmentsPaths })


    return newMessage
}

export async function getAllMessages(userId) {
    const messages = await find(messageModel, { $or: [{ sender: userId }, { receiver: userId }] })
    return messages
}

export async function getMessagesSentToMe(userId) {
    const messages = await find(messageModel, { receiver: userId })
    return messages
}

export async function getMessagesSentByMe(userId) {
    const messages = await find(messageModel, { sender: userId })
    return messages
}

export async function getMessageById(messageId) {
    const message = await findById(messageModel, messageId)
    return message
}

export async function getMessagesBetweenTwoUsers(userId1, userId2) {
    const messages = await find(messageModel, { $or: [{ sender: userId1, receiver: userId2 }, { sender: userId2, receiver: userId1 }] })
    return messages
}

export async function deleteMessage(messageId, userId) {
    const message = await findById(messageModel, messageId)

    if (!message) {
        notFoundException('message not found')
    }

    if (String(message.receiver) !== String(userId)) {
        notAuthorizedException('you are not authorized to delete this message')
    }

    await deleteOne(messageModel, { _id: messageId })
    return
}