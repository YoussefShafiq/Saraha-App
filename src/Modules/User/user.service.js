import userModel from "../../DB/Models/user.model.js"
import { deleteOne } from "../../DB/Repository/delete.repo.js"
import { findById, findOne } from "../../DB/Repository/get.repo.js"
import { findByIdAndUpdate } from "../../DB/Repository/update.repo.js"
import { conflictException, notFoundException } from "../../utils/response/failResponse.js"


export async function updateUser(id, body) {
    const { name, email, phone, DOB } = body
    if (email) {
        const exsistingUser = await findOne(userModel, { email })
        if (exsistingUser && exsistingUser._id.toString() !== id) {
            conflictException('email already exists')
        }
    }

    const updatedUser = await findByIdAndUpdate(userModel, id, {
        name, email, phone, DOB
    }, { new: true })

    return updatedUser
}

export async function deleteUser(_id) {
    const deletedUser = await deleteOne(userModel, { _id })

    if (deletedUser.deletedCount === 0) {
        notFoundException('user not found')
    }

    return deletedUser
}

export async function getUserById(id) {
    const user = await findById(userModel, id, '+isVerified +otp +otpExpires')
    return user
}