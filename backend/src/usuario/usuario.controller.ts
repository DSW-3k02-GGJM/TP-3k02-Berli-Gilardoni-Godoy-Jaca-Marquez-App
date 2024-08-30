import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { orm } from '../shared/db/orm.js';
import { User } from './usuario.entity.js';
import { AuthService } from '../shared/db/auth.service.js';


const em = orm.em;

const sanitizedUsuarioInput = (
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
        const usuarios = await em.find(
        User,
        {},
        {
            populate: [
            ],
        }
        );
        res
        .status(200)
        .json({ message: 'Todas los usuarios encontrados', data: usuarios });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params.id);
    const usuario = await em.findOneOrFail(
      User,
      { id },
      {
        populate: [
        ],
      }
    );
    res.status(200).json({ message: 'Usuario encontrado', data: usuario });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id);
      const usuario = await em.findOneOrFail(User, { id });
      em.assign(usuario, req.body.sanitizedInput);
      await em.flush();
      res.status(200).json({ message: 'Usuario actualizado', data: usuario });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const remove = async (req: Request, res: Response) => {
    try {
      const id = Number.parseInt(req.params.id);
      const usuario = em.getReference(User, id);
      await em.removeAndFlush(usuario);
      res.status(200).send({ message: 'Usuario eliminado' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.sanitizedInput.password;
    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = em.create(User, {
        ...req.body.sanitizedInput,
        password: hashedPassword,
      });
    await em.flush();

    //const token = AuthService.generateToken(usuario); // Crea un token y lo asocia al usuario
    const { password: _, ...usuarioPublico} = usuario;
    res.status(201).json({ message: 'Registro completo', data: usuarioPublico });
  } catch (error: any) {
    res.status(500).json({ message: error.message }); // No es recomendado mandar estos errores al frontend (le gusta a los hackers)
  }
};

const login = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const usuario = await em.findOne(
            User,
            { email },
            {
            populate: [
            ],
            }
            );
        if(!usuario){
            res.status(401).json({ message: 'Mail incorrecto' });
        }
        else {
            const isValid = await bcrypt.compare(password, usuario.password)
            if(!isValid){
                res.status(401).json({ message: 'Contraseña incorrecta' });
            }
            else {
                const token = AuthService.generateToken(usuario); // Crea un token y lo asocia al usuario
                const { password: _, ...usuarioPublico} = usuario;
                res
                    .cookie('access_token', token, {
                        httpOnly: true, // La cookie solo se puede acceder en el servidor (No se puede ver desde el cliente)
                        secure: true, // Funciona solo con https
                        sameSite: 'strict', // Solo se puede acceder en el mismo dominio
                        maxAge: 1000 * 60 * 60, // Dura 1h
                    })
                    .status(200).json({ message: 'Login completo', data: usuarioPublico});
            }
        }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  const logout = async (req: Request, res: Response) => {
    res
      .clearCookie('access_token')
      .status(200).json({ message: 'Logout completo' });
  };

  const verifyAuthentication = async (req: Request, res: Response) => {
      res.status(200).send({ message: "Authenticated" });
  };

export { sanitizedUsuarioInput, findAll, findOne, update, remove, register, login, logout, verifyAuthentication };
