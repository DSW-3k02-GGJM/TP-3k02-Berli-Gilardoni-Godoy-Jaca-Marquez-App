import jwt from 'jsonwebtoken';
import { Usuario } from '../../usuario/usuario.entity.js';
import { Request, Response, NextFunction } from 'express';

const SECRET_KEY = 'Aca va una clave secretisima que está publicada en github';

export class AuthService {
  static generateToken(usuario: Usuario): string {
    const payload = { id: usuario.id, email: usuario.email };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}