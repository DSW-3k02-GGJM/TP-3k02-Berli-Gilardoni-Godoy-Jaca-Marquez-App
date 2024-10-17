import jwt from 'jsonwebtoken';
import { User } from '../../user/user.entity.js';
import { Request, Response, NextFunction } from 'express';
import { orm } from './orm.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'

dotenv.config();

const em = orm.em.fork();
const SECRET_KEY = process.env.SECRET_KEY || 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era';

export class AuthService {
  static generateToken(user: User): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  }

  static verifyToken(token: string): any {
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
        return res.status(401).json({ message: 'Unauthorized access'});
      }
      try {
        data = AuthService.verifyToken(token);
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
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const admin = em.create(User, {
        email: process.env.ADMIN_EMAIL || 'admin@admin.com',
        password: hashedPassword,
        role: process.env.ADMIN_PASSWORD || 'admin',
        documentType: 'DNI',
        documentID: 'XXXXXXXX',
        userName: 'Admin',
        userSurname: 'Admin',
        birthDate: new Date(),
        address: 'Admin',
        phoneNumber: 'XXXX-XXXX',
        nationality: 'Peruano'
      });
      await em.flush();
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists');
    }
  }
}