// External Libraries
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  BACKEND_DOMAIN: z.string().url().default('http://localhost:'),
  BACKEND_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('3000'),
  FRONTEND_DOMAIN: z.string().url().default('http://localhost:'),
  FRONTEND_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('4200'),
  SECRET_KEY: z.string().default('clave1'),
  SECRET_EMAIL_KEY: z.string().default('clave2'),
  SECRET_PASSWORD_KEY: z.string().default('clave3'),
  EMAIL_USER: z.string().email().min(1),
  EMAIL_PASSWORD: z.string().min(1),
  ADMIN_EMAIL: z.string().email().default('admin@admin.com'),
  ADMIN_PASSWORD: z.string().default('admin'),
  MYSQL_CONNECTION: z.string().min(1),
});

const { success, error, data } = envSchema.safeParse(process.env);

if (!success) {
  console.error('❌ Error en las variables de entorno:');
  error.errors.forEach((err) => {
    console.error(`- ${err.path}: ${err.message}`);
  });

  process.exit(1);
}

export const {
  BACKEND_DOMAIN,
  BACKEND_PORT,
  FRONTEND_DOMAIN,
  FRONTEND_PORT,
  SECRET_KEY,
  SECRET_EMAIL_KEY,
  SECRET_PASSWORD_KEY,
  EMAIL_USER,
  EMAIL_PASSWORD,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  MYSQL_CONNECTION,
} = data;
