import { model, Schema } from "mongoose";
import { decrypt, encrypt, hash } from "../../utils/security/crypto.util.js";
import { providers, UserGenders, UserRoles } from "../../utils/enums/user.enum.js";

const messageSchema = new Schema({
    title: {
        type: String,
        requried: true,
        minLength: [3, 'name must be at least 3 characters long'],
        maxLength: [200, 'name must be at most 200 character long']
    },
    content: {
        type: String,
        required: true,
        minLength: [3, 'content must be at least 3 characters long'],
        maxLength: [1000, 'content must be at most 1000 character long']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {
    timestamps: true,
    virtuals: true,
    toJSON: {
        virtuals: true,
        getters: true
    },
    toObject: {
        virtuals: true,
        getters: true
    },
})

const messageModel = model('message', messageSchema)

export default messageModel