import jwt from "jsonwebtoken";
import { getSecretKey } from "../utils/security/secret.util.js";
import userModel from "../DB/Models/user.model.js";


export async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error('Unauthorized access, token missing', { cause: { statusCode: 403 } });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.decode(token);
    const role = decoded?.aud;

    const verified = jwt.verify(token, getSecretKey(role));


    const user = await userModel.findById(verified.sub)
    if (!user) {
        throw new Error('Unauthorized access, user not found', { cause: { statusCode: 403 } });
    }

    req.id = verified.sub;
    next();
}