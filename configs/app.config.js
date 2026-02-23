import path from "path"
import env from "dotenv"

const paths = {
    dev: path.resolve('./configs/.env.dev'),
    prod: path.resolve('./configs/.env.prod')
}

export const NODE_ENV = process.env.NODE_ENV || 'prod';

env.config({ path: paths[NODE_ENV] });

export const PORT = process.env.PORT || 3000
export const DB_URL = process.env.DB_URL || ''
export const USER_SECRET_KEY = process.env.USER_SECRET_KEY || ''
export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || ''
export const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || ''
export const EMAIL_USER = process.env.EMAIL_USER || ''
export const EMAIL_PASS = process.env.EMAIL_PASS || ''
