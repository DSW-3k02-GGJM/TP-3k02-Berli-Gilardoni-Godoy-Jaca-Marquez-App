// Express
import { Request, Response } from 'express';

// MikroORM
import { orm } from '../../shared/database/orm.js';

// Entities
import { User } from './user.entity.js';
import { Reservation } from '../reservation/reservation.entity.js';

// Services
import { AuthService } from '../../shared/services/auth.service.js';
import { MailService } from '../../shared/services/mail.service.js';

// Configuration
import {
  FRONTEND_DOMAIN,
  FRONTEND_PORT,
  SECRET_KEY,
  SECRET_EMAIL_KEY,
  SECRET_PASSWORD_KEY,
} from '../../config.js';

// External Libraries
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const frontendURL = `${FRONTEND_DOMAIN}${FRONTEND_PORT}`;

const em = orm.em;

const findAll = async (_req: Request, res: Response) => {
  try {
    const users = await em.find(User, {});
    res.status(200).json({ message: 'All users have been found', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOne(User, { id });
    if (!user) {
      res.status(404).json({ message: 'The user does not exist' });
    } else {
      res.status(200).json({ message: 'The user has been found', data: user });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  const password = req.body.sanitizedInput.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    em.create(User, {
      ...req.body.sanitizedInput,
      password: hashedPassword,
    });
    await em.flush();
    res.status(201).end();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOne(User, { id });
    if (!user) {
      res.status(404).json({ message: 'The user does not exist' });
    } else {
      em.assign(user, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The user has been updated' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOne(User, { id });
    const userInUse = await em.findOne(Reservation, { user: id });
    if (!user) {
      res.status(404).json({ message: 'The user does not exist' });
    } else if (userInUse) {
      res.status(400).json({
        message:
          'El usuario no se puede eliminar porque tiene reservas asociadas.',
      });
    } else {
      await em.removeAndFlush(user);
      res.status(200).json({ message: 'The user has been deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req: Request, res: Response) => {
  const email = req.body.sanitizedInput.email;
  const password = req.body.sanitizedInput.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = em.create(User, {
      ...req.body.sanitizedInput,
      password: hashedPassword,
      // By default, it is created as an unverified client
      role: 'client',
      verified: false,
    });
    await em.flush();
    const token = AuthService.generateToken(user, SECRET_EMAIL_KEY, '10m');
    const verificationLink = `${frontendURL}/verify-email/${token}`;
    await MailService.sendMail(
      [email],
      'Verificación de correo',
      '',
      'Para verificar su correo, haga click <a href="' +
        verificationLink +
        '">aquí</a>.'
    );
    res
      .status(200)
      .json({ message: 'Sign-up completed and verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req: Request, res: Response) => {
  const email = req.body.sanitizedInput.email;
  const password = req.body.sanitizedInput.password;
  try {
    const user = await em.findOne(User, { email });
    const isValid = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!user || !isValid) {
      return res
        .status(401)
        .json({ message: 'Email or password is incorrect' });
    }
    if (!user.verified) {
      return res.status(403).json({ message: 'Email not verified' });
    }
    const token = AuthService.generateToken(user, SECRET_KEY, '1h'); // Creates a token and associates it with the user
    res
      .cookie('access_token', token, {
        httpOnly: true, // Only accessible from the server
        secure: true, // Only sent over HTTPS connections
        sameSite: 'strict', // Sent only for same-site requests
        maxAge: 1000 * 60 * 60, // Expires in one hour
      })
      .status(200)
      .json({ message: 'Login completed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (_req: Request, res: Response) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Logout completed' });
};

const verifyAuthentication = async (req: Request, res: Response) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(200).json({ authenticated: false });
  }
  try {
    jwt.verify(token, SECRET_KEY);
    res.status(200).json({ authenticated: true });
  } catch (error) {
    res.status(200).json({ authenticated: false });
  }
};

const getAuthenticatedId = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ id: req.session.user.id });
  } catch (error) {
    res.status(200).json({ id: null });
  }
};

const getAuthenticatedRole = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ role: req.session.user.role });
  } catch (error) {
    res.status(200).json({ role: null });
  }
};

const sendEmailVerification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(401).json({ message: 'Email is required' });
    }
    const user = await em.findOne(User, { email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const token = AuthService.generateToken(user, SECRET_EMAIL_KEY, '10m');
      const verificationLink = `${frontendURL}/verify-email/${token}`;
      await MailService.sendMail(
        [email],
        'Verificación de correo',
        '',
        'Para verificar su correo, haga click <a href="' +
          verificationLink +
          '">aquí</a>.'
      );
      res.status(200).json({ message: 'Verification email sent' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access (invalid token)' });
  }
};

const getEmail = (user: JwtPayload | string): string => {
  return typeof user !== 'string' ? user.email : '';
};

const verifyEmailToken = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    if (!token) {
      res.status(401).json({ message: 'Token is required' });
    } else {
      const user = AuthService.verifyToken(token, SECRET_EMAIL_KEY);
      const userToUpdate = await em.findOne(User, {
        email: getEmail(user),
      });
      if (!userToUpdate) {
        res.status(404).json({ message: 'User not found' });
      } else if (userToUpdate.verified) {
        res.status(401).json({ message: 'The user is already verified' });
      } else {
        userToUpdate.verified = true;
        await em.flush();
        res.status(200).json({ message: 'User verified' });
      }
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access (invalid token)' });
  }
};

const sendPasswordReset = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await em.findOne(User, { email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const token = AuthService.generateToken(user, SECRET_PASSWORD_KEY, '10m');
      const resetLink = `${frontendURL}/reset-password/${token}`;
      await MailService.sendMail(
        [email],
        'Restablecimiento de contraseña',
        '',
        'Para restablecer su contraseña, haga click <a href="' +
          resetLink +
          '">aquí</a>.'
      );
      res.status(200).json({ message: 'Password reset email sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const verifyPasswordResetToken = async (req: Request, res: Response) => {
  try {
    const newPassword = req.body.sanitizedInput.newPassword;
    const token = req.params.token;
    if (!token) {
      res.status(401).json({ message: 'Token is required' });
    } else {
      const user = AuthService.verifyToken(token, SECRET_PASSWORD_KEY);
      const userToUpdate = await em.findOne(User, { email: getEmail(user) });
      if (!userToUpdate) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userToUpdate.password = hashedPassword;
        await em.flush();
        res.status(200).json({ message: 'Password updated' });
      }
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized access (invalid token)' });
  }
};

const verifyEmailExists = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    await em.findOneOrFail(User, { email });
    res.status(200).json({ exists: true });
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

const verifyDocumentIDExists = async (req: Request, res: Response) => {
  try {
    const documentID = req.params.documentID;
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(User, { documentID });
    if (user.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error) {
    res.status(200).json({ exists: false });
  }
};

const sendEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const { subject, message } = req.body.sanitizedInput;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await em.findOne(User, { email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      await MailService.sendMail([email], subject, message, '');
      res.status(200).json({ message: 'Email sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  add,
  findAll,
  findOne,
  update,
  remove,
  register,
  login,
  logout,
  verifyAuthentication,
  getAuthenticatedId,
  getAuthenticatedRole,
  sendEmailVerification,
  verifyEmailToken,
  sendPasswordReset,
  verifyPasswordResetToken,
  verifyEmailExists,
  verifyDocumentIDExists,
  sendEmail,
};
