import jwt from "jsonwebtoken";
import { getSignature } from "../utils/security/secret.util.js";
import userModel from "../DB/Models/user.model.js";
import { badRequestException, notAuthorizedException } from "../utils/response/failResponse.js";
import { TokenTypes } from "../utils/enums/security.enum.js";


export function verifyToken(refresh = false) {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            notAuthorizedException('Unauthorized access, token missing')
        }

        const [authType, token] = authHeader.split(" ");

        if (authType != 'Bearer') {
            notAuthorizedException('Unauthorized access, Invalid token type')
        }

        const decodedToken = jwt.decode(token);
        const role = decodedToken?.aud;
        const tokenType = decodedToken.type; //access or refresh

        if (refresh && tokenType != TokenTypes.refresh || !refresh && tokenType != TokenTypes.access) {
            notAuthorizedException('Unauthorized access, Invalid token type')
        }

        const { accessSignature, refreshSignature } = getSignature(role)
        const signature = tokenType == TokenTypes.access ? accessSignature : refreshSignature

        const verified = jwt.verify(token, signature);

        const user = await userModel.findById(verified.sub)
        if (!user) {
            notAuthorizedException('Unauthorized access, user not found')
        }

        req.user = user;
        next();
    }
}