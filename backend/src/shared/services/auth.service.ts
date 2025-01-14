// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../database/orm.js';

// Entities
import { User } from '../../core/user/user.entity.js';

// Configuration
import { SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD } from '../../config.js';

// External Libraries
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const em = orm.em.fork();

export class AuthService {
  static generateToken(
    user: User,
    SECRET_KEY: string,
    expiresIn: string
  ): string {
    const payload = { id: user.id, email: user.email, role: user.role };
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
  }

  static verifyToken(token: string, SECRET_KEY: string): JwtPayload | string {
    try {
      return jwt.verify(token, SECRET_KEY);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static getRole(data: JwtPayload | string): string {
    return typeof data !== 'string' ? data.role : '';
  }

  static isAuthenticated(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const token = req.cookies.access_token;
      let data = null;
      req.session = { user: null };

      if (!token) {
        return res
          .status(401)
          .json({ message: 'Unauthorized access (no token)' });
      }

      try {
        data = this.verifyToken(token, SECRET_KEY);

        if (!roles.includes(this.getRole(data))) {
          return res
            .status(401)
            .json({ message: 'Unauthorized access (role)' });
        }

        req.session.user = data;
      } catch (error) {
        return res.status(500).json({ message: 'Server error' });
      }
      next();
    };
  }

  static async ensureAdminExists() {
    const adminUser = await em.findOne(User, { role: 'admin' });

    const logAdminInformation = (email: string = '') => {
      console.log(`\nAdmin user ${
        email ? 'already exists' : 'created'
      }:\n - email (${email || ADMIN_EMAIL})\n - password (${ADMIN_PASSWORD})
      `);
    };

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      const today = new Date();
      today.setHours(today.getHours() - 3);

      em.create(User, {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        documentType: 'DNI',
        documentID: '12345678',
        userName: 'Admin',
        userSurname: 'Admin',
        birthDate: new Date(today.setFullYear(today.getFullYear() - 30))
          .toISOString()
          .split('T')[0],
        address: 'Admin 123',
        phoneNumber: '3419876543',
        nationality: 'Argentina',
        verified: true,
      });
      await em.flush();

      logAdminInformation();
    } else {
      logAdminInformation(adminUser.email);
    }
  }
}
