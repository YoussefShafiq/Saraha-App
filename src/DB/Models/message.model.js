import { model, Schema } from "mongoose";
import { decrypt, encrypt, hash } from "../../utils/security/crypto.util.js";
import { providers, UserGenders, UserRoles } from "../../utils/enums/user.enum.js";

const messageSchema = new Schema({
    content: {
        type: String,
        required: true,
        minLength: [3, 'content must be at least 3 characters long'],
        maxLength: [1000, 'content must be at most 1000 character long']
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    attachments: {
        type: [String],
        default: []
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