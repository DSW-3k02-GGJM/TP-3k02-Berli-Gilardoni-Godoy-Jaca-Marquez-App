import { Request, Response, NextFunction } from 'express';
import { orm } from '../shared/db/orm.js';
import { Usuario } from './usuario.entity.js';
import { AuthService } from '../shared/db/auth.service.js';

const em = orm.em;

const sanitizedUsuarioInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.body.sanitizedInput = {
    email: req.body.email,
    contraseña: req.body.contraseña,
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
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token no recibido' });
    }
    try {
        const decoded = AuthService.verifyToken(token); //Decodifica el token
        const usuario = await em.findOne(Usuario, { id: decoded.id }); //Busca el usuario por decodificada

        if (!usuario) {
            return res.status(401).json({ message: 'Token invalido' });
        }
        const usuarios = await em.find(
        Usuario,
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
      Usuario,
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
      const usuario = await em.findOneOrFail(Usuario, { id });
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
      const usuario = em.getReference(Usuario, id);
      await em.removeAndFlush(usuario);
      res.status(200).send({ message: 'Usuario eliminado' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

const register = async (req: Request, res: Response) => {
  try {
    const usuario = em.create(Usuario, req.body.sanitizedInput);
    await em.flush();

    const token = AuthService.generateToken(usuario); // Crea un token y lo asocia al usuario
    res.status(201).json({ message: 'Usuario creado', data: usuario , token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const contraseña = req.body.contraseña;
        const usuario = await em.findOne(
            Usuario,
            { email },
            {
            populate: [
            ],
            }
      );

      if(!usuario){res.status(401).json({ message: 'Mail incorrecto' });}
      else {
        if(usuario.contraseña !== contraseña){res.status(401).json({ message: 'Contraseña incorrecta' });}
        else {
            const token = AuthService.generateToken(usuario);
            res.status(200).json({ message: 'Usuario encontrado', data: usuario, token});
        }
    }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

export { sanitizedUsuarioInput, findAll, findOne, update, remove, register, login };
