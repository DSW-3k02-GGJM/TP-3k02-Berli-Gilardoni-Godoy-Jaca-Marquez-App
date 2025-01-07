// Express
import { Request, Response, NextFunction } from 'express';

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

const frontendURL = `${FRONTEND_DOMAIN}${FRONTEND_PORT}`;

const em = orm.em;

const sanitizedPasswordResetInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    newPassword: req.body.newPassword,
    confirmPassword: req.body.confirmPassword,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const newPassword = req.body.sanitizedInput.newPassword;
  const confirmPassword = req.body.sanitizedInput.confirmPassword;

  if (!newPassword || !confirmPassword) {
    return res
      .status(400)
      .json({ message: 'New password and confirm password are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  next();
};

const sanitizedLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    email: req.body.email,
    password: req.body.password,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const email = req.body.sanitizedInput.email;
  const password = req.body.sanitizedInput.password;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
  }

  if (!isValidEmailFormat(email)) {
    return res.status(400).json({ message: 'Email is not valid' });
  }

  next();
};

const sanitizedUserInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    documentType: req.body.documentType,
    documentID: req.body.documentID,
    userName: req.body.userName,
    userSurname: req.body.userSurname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    nationality: req.body.nationality,
    reservations: req.body.reservations,

    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    verified: req.body.verified,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  const documentType = req.body.sanitizedInput.documentType;
  const documentID = req.body.sanitizedInput.documentID;
  const userName = req.body.sanitizedInput.userName;
  const userSurname = req.body.sanitizedInput.userSurname;
  const birthDate = req.body.sanitizedInput.birthDate;
  const address = req.body.sanitizedInput.address;
  const phoneNumber = req.body.sanitizedInput.phoneNumber;
  const nationality = req.body.sanitizedInput.nationality;

  const email = req.body.sanitizedInput.email;
  const password = req.body.sanitizedInput.password;

  if (
    !documentType ||
    !documentID ||
    !userName ||
    !userSurname ||
    !birthDate ||
    !address ||
    !phoneNumber ||
    !nationality ||
    !email ||
    !password
  ) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (!isValidEmailFormat(email)) {
    return res.status(400).json({ message: 'Email is not valid' });
  }

  const userEmail = await em.findOne(User, { email });
  if (userEmail) {
    return res.status(400).json({ message: 'This email is already used' });
  }

  const userDocID = await em.findOne(User, { documentID });
  if (userDocID) {
    return res
      .status(400)
      .json({ message: 'This document ID is already used' });
  }

  next();
};

const sanitizedPartialUpdateInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    documentType: req.body.documentType,
    documentID: req.body.documentID,
    userName: req.body.userName,
    userSurname: req.body.userSurname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    nationality: req.body.nationality,
    reservations: req.body.reservations,

    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    verified: req.body.verified,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
};

const isValidEmailFormat = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const findAll = async (req: Request, res: Response) => {
  try {
    const users = await em.find(User, {});
    res.status(200).json({ message: 'All users have been found', data: users });
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const add = async (req: Request, res: Response) => {
  const password = req.body.sanitizedInput.password;
  const role = req.body.sanitizedInput.role;
  const verified = req.body.sanitizedInput.verified;

  if (!role || verified === undefined) {
    return res.status(400).json({ message: 'All information is required' });
  }

  if (role !== 'admin' && role !== 'employee' && role !== 'client') {
    return res.status(400).json({ message: 'Role does not exist' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    em.create(User, {
      ...req.body.sanitizedInput,
      password: hashedPassword,
    });
    await em.flush();
    res.status(201).end();
  } catch (error: any) {
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
  } catch (error: any) {
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
      res.status(400).json({ message: 'The user is in use' });
    } else {
      await em.removeAndFlush(user);
      res.status(200).send({ message: 'The user has been deleted' });
    }
  } catch (error: any) {
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
  } catch (error: any) {
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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = async (req: Request, res: Response) => {
  res
    .clearCookie('access_token')
    .status(200)
    .json({ message: 'Logout completed' });
};

const verifyAuthentication = async (req: Request, res: Response) => {
  res.status(200).send({ message: 'Authenticated' });
};

const verifyEmailExists = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    await em.findOneOrFail(User, { email });
    res.status(200).json({ exists: true });
  } catch (error: any) {
    res.status(200).json({ exists: false });
  }
};

const verifyDocumentIDExists = async (req: Request, res: Response) => {
  try {
    const documentID = req.params.documentID;
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(User, { documentID: documentID });
    if (user.id === id) {
      res.status(200).json({ exists: false });
    } else {
      res.status(200).json({ exists: true });
    }
  } catch (error: any) {
    res.status(200).json({ exists: false });
  }
};

const getAuthenticatedId = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ id: req.session.user.id });
  } catch (error: any) {
    res.status(200).json({ id: null });
  }
};

const getAuthenticatedRole = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ role: req.session.user.role });
  } catch (error: any) {
    res.status(200).json({ role: null });
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
  } catch (error: any) {
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
      const userToUpdate = await em.findOne(User, { email: user.email });
      if (!userToUpdate) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userToUpdate.password = hashedPassword;
        await em.flush();
        res.status(200).json({ message: 'Password updated' });
      }
    }
  } catch (error: any) {
    res.status(401).json({ message: 'Unauthorized access (invalid token)' });
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
  } catch (error: any) {
    res.status(401).json({ message: 'Unauthorized access (invalid token)' });
  }
};

const verifyEmailToken = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    if (!token) {
      res.status(401).json({ message: 'Token is required' });
    } else {
      const user = AuthService.verifyToken(token, SECRET_EMAIL_KEY);
      const userToUpdate = await em.findOne(User, { email: user.email });
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
  } catch (error: any) {
    res.status(401).json({ message: 'Unauthorized access (invalid token)' });
  }
};

const sendEmail = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const subject = req.body.subject;
    const message = req.body.message;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!subject || !message) {
      return res
        .status(400)
        .json({ message: 'Subject and message are required' });
    }
    const user = await em.findOne(User, { email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      await MailService.sendMail([email], subject, message, '');
      res.status(200).json({ message: 'Email sent' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Server error' });
  }
};

export {
  sanitizedPasswordResetInput,
  sanitizedLoginInput,
  sanitizedUserInput,
  sanitizedPartialUpdateInput,
  add,
  findAll,
  findOne,
  update,
  remove,
  register,
  login,
  logout,
  verifyAuthentication,
  verifyEmailExists,
  verifyDocumentIDExists,
  getAuthenticatedId,
  getAuthenticatedRole,
  sendPasswordReset,
  verifyPasswordResetToken,
  sendEmailVerification,
  verifyEmailToken,
  sendEmail,
};
