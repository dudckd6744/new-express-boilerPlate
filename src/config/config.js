import { config } from 'dotenv';
config();

export const jwtSecret = process.env.JWT_SECRET;
