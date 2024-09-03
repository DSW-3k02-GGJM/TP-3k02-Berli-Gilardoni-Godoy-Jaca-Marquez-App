import jwt from 'jsonwebtoken';
import { User } from '../../user/user.entity';
import { Request, Response, NextFunction } from 'express';
import { orm } from './orm.js';
const em = orm.em;
const SECRET_KEY = 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era';

export class AuthService {
  static generateToken(user: User): string {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  }

  static verifyToken(token: string): any {
    try {
      console.log('token', token);
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static isAuthenticated(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.access_token;
    let data = null;

    req.session = { user: null };
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access'});
    }
    try {
      data = AuthService.verifyToken(token);
      req.session.user = data;
    } 
    catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
    next();
  }

}