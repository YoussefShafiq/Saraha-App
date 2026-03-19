import { badRequestException } from "../utils/response/failResponse.js"

export function validation(schema) {
    return (req, res, next) => {

        const validationErrors = []

        for (const schemaKey of Object.keys(schema)) {
            const validateResult = schema[schemaKey].validate(req[schemaKey], { abortEarly: false })
            if (validateResult.error?.details.length > 0) {
                validationErrors.push(validateResult.error)
            }
            if (schemaKey != 'query') {
                req[schemaKey] = validateResult.value
            } else {
                req['v' + schemaKey] = validateResult.value
            }
        }

        let message = validationErrors.map(v => v.message)

        if (validationErrors.length > 0) {
            badRequestException(message)
        }

        next()
    }
}