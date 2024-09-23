import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import { User } from './user.entity.js';
import { AuthService } from '../shared/db/auth.service.js';


const em = orm.em;

const sanitizedUserInput = (
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
    res.status(200).json({ message: 'The user has been found', data: user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id);
      const user = await em.findOneOrFail(User, { id });
      em.assign(user, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'The user has been updated', data: user });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const remove = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id);
      const user = em.getReference(User, id);
      await em.removeAndFlush(user);
      res.status(200).send({ message: 'The user has been eliminated' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.sanitizedInput.password;
    const email = req.body.sanitizedInput.email;
    if (!password || !email) {
      return res.status(401).json({ message: 'Email and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const userR = await em.findOne( User , { email } , {populate: [] , });
    if(userR){
      return res.status(401).json({ message: 'This email is already used' });
    }
    const user = em.create(User, {
        ...req.body.sanitizedInput,
        password: hashedPassword,
        role: 'client', // Por defecto se crea como cliente
      });
    await em.flush();

    //const token = AuthService.generateToken(usuario); // Crea un token y lo asocia al usuario
    const { password: _, ...publicUser} = user;
    const token = AuthService.generateToken(user); // Crea un token y lo asocia al usuario
    res.cookie('access_token', token, {
              httpOnly: true, // La cookie solo se puede acceder en el servidor (No se puede ver desde el cliente)
              secure: true, // Funciona solo con https
              sameSite: 'strict', // Solo se puede acceder en el mismo dominio
              maxAge: 1000 * 60 * 60, // Dura 1h
          })
          .status(200).json({ message: 'Sign-up and Login completed', data: publicUser});
  } catch (error: any) {
    res.status(500).json({ message: error.message }); // No es recomendado mandar estos errores al frontend (le gusta a los hackers)
  }
};

const login = async (req: Request, res: Response) => {
    try {
        const email = req.body.sanitizedInput.email;
        const password = req.body.sanitizedInput.password;
        if (!password || !email) {
          return res.status(401).json({ message: 'Email and password are required' });
        }
        
        const user = await em.findOne( User , { email } , {populate: [] , });
        if(!user){
          return res.status(401).json({ message: 'Incorrect email' });
        }
        else {
            const isValid = await bcrypt.compare(password, user.password)
            if(!isValid){
              return res.status(401).json({ message: 'Wrong password' });
            }
            else {
                const token = AuthService.generateToken(user); // Crea un token y lo asocia al usuario
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
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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

export { sanitizedUserInput, findAll, findOne, update, remove, register, login, logout, verifyAuthentication, verifyEmailExists};
