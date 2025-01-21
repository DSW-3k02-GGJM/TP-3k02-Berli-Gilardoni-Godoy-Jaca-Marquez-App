// External Libraries
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  BACKEND_URL: z.string().url().default('http://localhost:3000'),
  FRONTEND_URL: z.string().url().default('http://localhost:4200'),
  SECRET_KEY: z.string().default('password1'),
  SECRET_EMAIL_KEY: z.string().default('password2'),
  SECRET_PASSWORD_KEY: z.string().default('password3'),
  EMAIL_USER: z.string().email().min(1),
  EMAIL_PASSWORD: z.string().min(1),
  ADMIN_EMAIL: z.string().email().default('admin@admin.com'),
  ADMIN_PASSWORD: z.string().default('admin'),
  MYSQL_CONNECTION: z.string().min(1),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error('❌ Error in environment variables:');
  error.errors.forEach((err) => {
    console.error(`- ${err.path}: ${err.message}`);
  });

  process.exit(1);
}

export const {
  BACKEND_URL,
  FRONTEND_URL,
  SECRET_KEY,
  SECRET_EMAIL_KEY,
  SECRET_PASSWORD_KEY,
  EMAIL_USER,
  EMAIL_PASSWORD,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  MYSQL_CONNECTION,
} = data;
