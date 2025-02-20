// External Libraries
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(['test', 'development', 'production'])
    .default('development'),
  BACKEND_URL: z.string().url().default('http://localhost:3000/'),
  FRONTEND_URL: z.string().url().default('http://localhost:4200/'),
  SECRET_KEY: z.string().default('password1'),
  SECRET_EMAIL_KEY: z.string().default('password2'),
  SECRET_PASSWORD_KEY: z.string().default('password3'),
  EMAIL_USER: z.string().email().default('alquilcarreservas@gmail.com'),
  EMAIL_PASSWORD: z.string().default('password4'),
  ADMIN_EMAIL: z.string().email().default('admin@admin.com'),
  ADMIN_PASSWORD: z.string().default('admin'),
  MYSQL_CONNECTION: z.string().min(1),
  MYSQL_CONNECTION_TEST: z.string().min(1),
  DATABASE_NAME: z.string().default('alquiler_vehiculos'),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error('❌ Error in environment variables:');
  error.errors.forEach((err) => {
    console.error(`- ${err.path}: ${err.message}`);
  });

  process.exit(1);
}

const MYSQL_CONNECTION_URL =
  data.NODE_ENV === 'test' ? data.MYSQL_CONNECTION_TEST : data.MYSQL_CONNECTION;

export const {
  NODE_ENV,
  BACKEND_URL,
  FRONTEND_URL,
  SECRET_KEY,
  SECRET_EMAIL_KEY,
  SECRET_PASSWORD_KEY,
  EMAIL_USER,
  EMAIL_PASSWORD,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  DATABASE_NAME,
} = data;

export { MYSQL_CONNECTION_URL };
