import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import { User } from './user.entity.js';
import { AuthService } from '../shared/db/auth.service.js';
import { Console } from 'console';
import { Reservation } from '../reservation/reservation.entity.js';
import { MailService } from '../shared/db/mail.service.js';
import dotenv from 'dotenv'

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era';
const SECRET_EMAIL_KEY = process.env.SECRET_EMAIL_KEY || 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era parte 2';
const SECRET_PASSWORD_KEY = process.env.SECRET_PASSWORD_KEY || 'Aca va una clave secretisima que está publicada en github usea que tan secreta no era parte 3';
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:4200';

const em = orm.em;


const sanitizedLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    email: req.body.email,
    password: req.body.password,
  };
  // Más validaciones
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
};

const sanitizedUserInput = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    verified: req.body.verified,
    documentType: req.body.documentType,
    documentID: req.body.documentID,
    userName: req.body.userName,
    userSurname: req.body.userSurname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    nationality: req.body.nationality,
    reservations: req.body.reservations,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
};

const sanitizedNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    verified: req.body.verified,

    documentType: req.body.documentType,
    documentID: req.body.documentID,
    userName: req.body.userName,
    userSurname: req.body.userSurname,
    birthDate: req.body.birthDate,
    address: req.body.address,
    phoneNumber: req.body.phoneNumber,
    nationality: req.body.nationality,
    reservations: req.body.reservations,
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
};

const add = async (req: Request, res: Response) => {
  const password = req.body.sanitizedInput.password;
  const email = req.body.sanitizedInput.email;
  const documentType = req.body.sanitizedInput.documentType;
  const documentID = req.body.sanitizedInput.documentID;
  const userName = req.body.sanitizedInput.userName;
  const userSurname = req.body.sanitizedInput.userSurname;
  const birthDate = req.body.sanitizedInput.birthDate;
  const address = req.body.sanitizedInput.address;
  const phoneNumber = req.body.sanitizedInput.phoneNumber;
  const nationality = req.body.sanitizedInput.nationality;
  const role = req.body.sanitizedInput.role;
  const verified = req.body.sanitizedInput.verified;


  if (!password || !email || !role) {
    return res.status(400).json({ message: 'Email, password and role are required' });
  }

  if(role !== 'admin' && role !== 'employee' && role !== 'client') {
    return res.status(400).json({ message: 'Role does not exist' });
  }

  if(!email.includes('@') || !email.includes('.')) { 
    return res.status(400).json({ message: 'Invalid email' });
  }

  if(!documentType || !documentID || !userName || !userSurname || !birthDate || !address || !phoneNumber || !nationality || verified === null) {
    return res.status(400).json({ message: 'All information are required'});
  }
  const userE = await em.findOne( User , { email } , {populate: [] , });
  if(userE){
    return res.status(400).json({ message: 'This email is already used' });
  }

  const userD = await em.findOne( User , { documentID } , {populate: [] , });
  if(userD){
    return res.status(400).json({ message: 'This document ID is already used' });
  }
  try {
    const password = req.body.sanitizedInput.password;
    const email = req.body.sanitizedInput.email;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = em.create(User, {
        ...req.body.sanitizedInput,
        password: hashedPassword,
      });
    await em.flush();
    res.status(200).json({ message: 'The user has been created', data: user });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const findAll = async (req: Request, res: Response) => {
    try {
        // Comportamiento de la ruta
        const users = await em.find(
        User,
        {},
        {
            populate: [
            ],
        }
        );
        res
        .status(200)
        .json({ message: 'All users have been found', data: users });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(
      User,
      { id },
      {
        populate: [
        ],
      }
    );
    if (!user) {
      res.status(404).json({ message: 'The user does not exist' });
    }
    else {
      res.status(200).json({ message: 'The user has been found', data: user });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const staffUpdate = async (req: Request, res: Response) => {
  const documentType = req.body.sanitizedInput.documentType;
  const documentID = req.body.sanitizedInput.documentID;
  const userName = req.body.sanitizedInput.userName;
  const userSurname = req.body.sanitizedInput.userSurname;
  const birthDate = req.body.sanitizedInput.birthDate;
  const address = req.body.sanitizedInput.address;
  const phoneNumber = req.body.sanitizedInput.phoneNumber;
  const nationality = req.body.sanitizedInput.nationality;
  const role = req.body.sanitizedInput.role;
  const verified = req.body.sanitizedInput.verified;
  const id = Number.parseInt(req.params.id);

  if(!documentType || !documentID || !userName || !userSurname || !birthDate || !address || !phoneNumber || !nationality || !role || verified === null) {
    return res.status(400).json({ message: 'All information is required'});
  }

  if(role !== 'admin' && role !== 'employee' && role !== 'client') {
    return res.status(400).json({ message: 'Role does not exist' });
  }
  
  const userD = await em.findOne( User , { documentID } , {populate: [] , });
  if(userD){
    if (userD.id !== id) {
      return res.status(400).json({ message: 'This document ID is already used' });
    }
  }
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOne(User, { id });
    if (!user) {
      res.status(404).json({ message: 'The user does not exist' });
    }
    else {
      em.assign(user, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The user has been updated', data: user });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const update = async (req: Request, res: Response) => {
  const documentType = req.body.sanitizedInput.documentType;
  const documentID = req.body.sanitizedInput.documentID;
  const userName = req.body.sanitizedInput.userName;
  const userSurname = req.body.sanitizedInput.userSurname;
  const birthDate = req.body.sanitizedInput.birthDate;
  const address = req.body.sanitizedInput.address;
  const phoneNumber = req.body.sanitizedInput.phoneNumber;
  const nationality = req.body.sanitizedInput.nationality;
  const id = Number.parseInt(req.params.id);

  if(!documentType || !documentID || !userName || !userSurname || !birthDate || !address || !phoneNumber || !nationality) {
    return res.status(400).json({ message: 'All information is required'});
  }

  const userD = await em.findOne( User , { documentID } , {populate: [] , });
  if(userD){
    if (userD.id !== id) {
      return res.status(400).json({ message: 'This document ID is already used' });
    }
  }
  try {
    const id = Number.parseInt(req.params.id);
    const user = await em.findOne(User, { id });
    if (!user) {
      res.status(404).json({ message: 'The user does not exist' });
    }
    else {
      em.assign(user, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The user has been updated', data: user });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};
  
  const remove = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id);
      const user = await em.findOne(User, { id });
      const userInUse = await em.findOne( Reservation, { user: id }); //TODO: Debería ser user
      if (!user) {
        res.status(404).json({ message: 'The user does not exist' });
      }
      else if (userInUse) {
          res.status(400).json({ message: 'The user is in use' });
      }
      else {
        const userReference = em.getReference(User, id);
        await em.removeAndFlush(userReference);
        res.status(200).send({ message: 'The user has been eliminated' });
      }

    } catch (error: any) {
      console.log(error.message);
      res.status(500).json({ message: "Server error" });
    }
  };

const register = async (req: Request, res: Response) => {
  const password = req.body.sanitizedInput.password;
  const email = req.body.sanitizedInput.email;
  const documentType = req.body.sanitizedInput.documentType;
  const documentID = req.body.sanitizedInput.documentID;
  const userName = req.body.sanitizedInput.userName;
  const userSurname = req.body.sanitizedInput.userSurname;
  const birthDate = req.body.sanitizedInput.birthDate;
  const address = req.body.sanitizedInput.address;
  const phoneNumber = req.body.sanitizedInput.phoneNumber;
  const nationality = req.body.sanitizedInput.nationality;

  if (!password || !email) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if(!email.includes('@') || !email.includes('.')) { 
    return res.status(400).json({ message: 'Invalid email' });
  }

  if(!documentType || !documentID || !userName || !userSurname || !birthDate || !address || !phoneNumber || !nationality) {
    return res.status(400).json({ message: 'All information are required'});
  }
  const userE = await em.findOne( User , { email } , {populate: [] , });
  if(userE){
    return res.status(400).json({ message: 'This email is already used' });
  }

  const userD = await em.findOne( User , { documentID } , {populate: [] , });
  if(userD){
    return res.status(400).json({ message: 'This document id is already used' });
  }
  try {
    const password = req.body.sanitizedInput.password;
    const email = req.body.sanitizedInput.email;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = em.create(User, {
        ...req.body.sanitizedInput,
        password: hashedPassword,
        role: 'client', // Por defecto se crea como cliente
        verified: false, // Por defecto no está verificado
      });
    await em.flush();

    const token = AuthService.generateToken(user, SECRET_EMAIL_KEY, '10m');
    const verificationLink = `${frontendURL}/verify-email/${token}`;
    await MailService.sendMail(
      [email],
      'Verificación de correo',
      '',
      'Para verificar su correo haga click <a href="'+ verificationLink +'">aquí</a>.'
    );
    res.status(200).json({ message: 'Sign-up completed and verification email sent' });
    /*
    //const token = AuthService.generateToken(usuario); // Crea un token y lo asocia al usuario
    const { password: _, ...publicUser} = user;
    const token = AuthService.generateToken(user, SECRET_KEY, '1h'); // Crea un token y lo asocia al usuario
    res.cookie('access_token', token, {
              httpOnly: true, // La cookie solo se puede acceder en el servidor (No se puede ver desde el cliente)
              secure: true, // Funciona solo con https
              sameSite: 'strict', // Solo se puede acceder en el mismo dominio
              maxAge: 1000 * 60 * 60, // Dura 1h
          })
          .status(200).json({ message: 'Sign-up completed', data: publicUser});
    */
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  const password = req.body.sanitizedInput.password;
  const email = req.body.sanitizedInput.email;

  if (!password || !email) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if(!email.includes('@') || !email.includes('.')) { 
    return res.status(400).json({ message: 'Invalid email' });
  }
  try {
      const email = req.body.sanitizedInput.email;
      const password = req.body.sanitizedInput.password;
      
      const user = await em.findOne( User , { email } , {populate: [] , });
      if(!user){
        return res.status(401).json({ message: 'Wrong email' });
      }
      else {
        if (!user.verified) {
          return res.status(403).json({ message: 'Email not verified' });
        } 
        else {
          const isValid = await bcrypt.compare(password, user.password)
          if(!isValid){
            return res.status(401).json({ message: 'Wrong password' });
          }
          else {
              const token = AuthService.generateToken(user, SECRET_KEY, '1h'); // Crea un token y lo asocia al usuario
              const { password: _, ...publicUser} = user;
              res
                  .cookie('access_token', token, {
                      httpOnly: true, // La cookie solo se puede acceder en el servidor (No se puede ver desde el cliente)
                      secure: true, // Funciona solo con https
                      sameSite: 'strict', // Solo se puede acceder en el mismo dominio
                      maxAge: 1000 * 60 * 60, // Dura 1h
                  })
                  .status(200).json({ message: 'Login completed'});
          }
        }
      }
        
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  res
    .clearCookie('access_token')
    .status(200).json({ message: 'Logout completed' });
};

  const verifyAuthentication = async (req: Request, res: Response) => {
    res.status(200).send({ message: "Authenticated" });
  };

const verifyEmailExists = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const user = await em.findOneOrFail(
      User,
      { email: email });
    res.status(200).json({ exists: true });
  }
  catch (error: any) {
    res.status(200).json({ exists: false});
  }
};

const verifyDocumentIDExists = async (req: Request, res: Response) => {
  try {
    const documentID = req.params.documentID;
    const id = Number.parseInt(req.params.id);
    const user = await em.findOneOrFail(
      User,
      { documentID: documentID });
    if (user.id === id) {
      res.status(200).json({ exists: false });
    }
    else {
      res.status(200).json({ exists: true });
    }
  }
  catch (error: any) {
    res.status(200).json({ exists: false});
  }
};

const getAuthenticatedId = async (req: Request, res: Response) => {
  try {
    const id = req.session.user.id;
    res.status(200).json({ id });
  }
  catch (error: any) {
    res.status(200).json({ id: null });
  }
}

const getAuthenticatedRole = async (req: Request, res: Response) => {
  try {
    const role = req.session.user.role;
    console.log(role);
    res.status(200).json({ role });
  }
  catch (error: any) {
    res.status(200).json({ role: null });
  }
}

const mailExample = async (req: Request, res: Response) => {
  try {
    await MailService.sendMail(
      ['matiastmarquez@gmail.com'],
      'Prueba de correo',
      'Esto es una prueba de correo',
      ''
    );

  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
}

const sendEmailVerification = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await em.findOne(
      User,
      { email: email });
    if (!user) { 
      return res.status(404).json({ message: 'User not found' });
    }
    else {
      const token = AuthService.generateToken(user, SECRET_EMAIL_KEY, '10m'); // Crea un token y lo asocia al usuario
      const verificationLink = `${frontendURL}/verify-email/${token}`;
      await MailService.sendMail(
        [email],
        'Verificación de correo',
        '',
        'Para verificar su correo haga click <a href="'+ verificationLink +'">aquí</a>.'
      );
      res.status(200).json({ message: 'Verification email sent' });
    }
  }
  catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
}

const verifyEmailToken = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    console.log(token);
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    else {
      const user = AuthService.verifyToken(token, SECRET_EMAIL_KEY);
      const userToUpdate = await em.findOne(
        User,
        { email: user.email });
      if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
      }
      else if (userToUpdate.verified) {
        return res.status(401).json({ message: 'The user is already verified' });
      }
      else {
        userToUpdate.verified = true;
        await em.flush();
        res.status(200).json({ message: 'User verified' });
      }
    } 
  }
  catch (error: any) {
    return res.status(401).json({ message: 'Unauthorized access (invalid token)' });
  }  
}


export { 
  sanitizedNewUser, 
  sanitizedLoginInput, 
  sanitizedUserInput,
  sendEmailVerification, 
  add, 
  findAll, 
  findOne, 
  update,
  staffUpdate, 
  remove, 
  register, 
  login, 
  logout, 
  verifyAuthentication, 
  verifyEmailExists, 
  verifyDocumentIDExists, 
  getAuthenticatedId, 
  getAuthenticatedRole,
  mailExample,
  verifyEmailToken
};
