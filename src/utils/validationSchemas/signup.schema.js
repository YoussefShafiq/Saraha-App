import Joi from 'joi'
import { UserGenders, UserRoles } from '../enums/user.enum.js'

export const signupSchema = {
    body: Joi.object({
        name: Joi.string().alphanum().required().min(3).messages({
            "string.alphanum": "name cannot contain special characters"
        }),
        email: Joi.string().email().required().messages({
            "any.required": "email is required",
            "string.email": "invalid email"
        }),
        password: Joi.string().required().min(5),
        phone: Joi.string().alphanum().max(11),
        DOB: Joi.date(),
        role: Joi.string().valid(...Object.values(UserRoles)).default(UserRoles.user),
        gender: Joi.string().valid(...Object.values(UserGenders)).default(UserGenders.male),
    }).required()
}
