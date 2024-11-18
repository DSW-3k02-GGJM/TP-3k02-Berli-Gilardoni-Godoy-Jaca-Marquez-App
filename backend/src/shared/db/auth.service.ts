import jwt from 'jsonwebtoken';
import { User } from '../../user/user.entity.js';
import { Request, Response, NextFunction } from 'express';
import { orm } from './orm.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'

dotenv.config();

const em = orm.em.fork();
const SECRET_KEY = process.env.SECRET_KEY || 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era';
const SECRET_EMAIL_KEY = process.env.SECRET_EMAIL_KEY || 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era parte 2';
const SECRET_PASSWORD_KEY = process.env.SECRET_PASSWORD_KEY || 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era parte 3';

export class AuthService {
  static generateToken(user: User, SECRET_KEY: string, expiresIn: string): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
  }

  static verifyToken(token: string, SECRET_KEY: string): any {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static isAuthenticated(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.access_token;
      let data = null;
      req.session = { user: null };

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized access (no token)'});
      }
      try {
        data = AuthService.verifyToken(token, SECRET_KEY);
        if (!roles.includes(data.role)) {
          return res.status(401).json({ message: 'Unauthorized access (role)'});
        }
        if ( req.params.id && data.role == 'client' && data.id != req.params.id) {
          return res.status(401).json({ message: 'Unauthorized access (id)'}); // verifica si es el mismo usuario en caso de ser cliente
        }
        
        req.session.user = data;
      } 
      catch (error: any) {
        return res.status(401).json({ message: error.message });
      }
      next();
    };
  }

  static async ensureAdminExists() {
    const adminUser = await em.findOne(User, { role: 'admin' });
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const admin = em.create(User, {
        email: process.env.ADMIN_EMAIL || 'admin@admin.com',
        password: hashedPassword,
        role: 'admin',
        documentType: 'DNI',
        documentID: 'XXXXXXXX',
        userName: 'Admin',
        userSurname: 'Admin',
        birthDate: new Date(),
        address: 'Admin',
        phoneNumber: 'XXXX-XXXX',
        nationality: 'Peruano',
        verified: true,
      });
      await em.flush();
      console.log('Admin user created:\n\temail:', admin.email, '\n\tpassword:', adminPassword);
    } else {
      console.log('Admin user already exists:\n\temail:', adminUser.email,'\n\tpassword:', adminPassword);
    }
  }
}