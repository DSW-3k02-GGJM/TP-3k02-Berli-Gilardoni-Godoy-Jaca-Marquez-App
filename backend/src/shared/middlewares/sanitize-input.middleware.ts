// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../database/orm.js';

// Entities
import { BaseEntity } from '../database/base.entity.js';

// Types
import { Entity } from '../types/custom/entity.type.js';

// Utils
import { formatDateToDash } from '../utils/format-date.js';

// External Libraries
import { isBefore, isAfter } from 'date-fns';

/**
Middleware to sanitize and validate inputs.
@param required Array with the mandatory fields of the entity.
@param moveQueryValuesToBody Boolean indicating whether it is necessary to move the query values to the body.
@param uppercase Array with the fields that should be converted to uppercase (optional).
@param numeric Array with the fields that should be positive numeric values (optional).
@param date Array with the fields that should be valid dates (optional).
@param dateRange Object with start and end date fields to validate that the dates are correct (optional).
@param email Array with the fields that should be valid email addresses (optional).
@param role Array with the valid roles for the entity (optional).
@param match Object with key-value pairs representing fields that should match (optional).
@param unique Array with the fields that should be unique (optional).
@param entity Entity for uniqueness validation (optional).
*/

export const sanitizeInput = (options: {
  required: string[];
  moveQueryValuesToBody?: boolean;
  uppercase?: string[];
  numeric?: string[];
  date?: string[];
  dateRange?: { startDate: string; endDate: string };
  email?: string[];
  role?: string[];
  match?: { [key: string]: string };
  unique?: string[];
  entity?: Entity;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const em = orm.em;

    const {
      required,
      moveQueryValuesToBody,
      uppercase,
      numeric,
      date,
      dateRange,
      email,
      role,
      match,
      unique,
      entity,
    } = options;

    if (moveQueryValuesToBody) {
      req.body = { ...req.query };
    }

    req.body.sanitizedInput = { ...req.body };

    if (required.length > 0) {
      req.body.sanitizedInput = required.reduce(
        (acc: { [key: string]: string }, field) => {
          if (req.body[field] !== undefined) {
            acc[field] = req.body[field];
          }
          return acc;
        },
        {}
      );

      const missing = required.filter(
        (field) => req.body.sanitizedInput[field] === undefined
      );
      if (missing.length > 0) {
        return res.status(400).json({
          message: `Toda la información es requerida. Falta(n): ${missing.join(
            ', '
          )}`,
        });
      }
    }

    if (uppercase) {
      uppercase.forEach((field) => {
        if (req.body.sanitizedInput[field]) {
          req.body.sanitizedInput[field] =
            req.body.sanitizedInput[field].toUpperCase();
        }
      });
    }

    if (numeric) {
      for (const field of numeric) {
        const value = req.body.sanitizedInput[field];
        if (value !== undefined && (isNaN(value) || value < 0)) {
          return res.status(400).json({
            message: `El campo "${field}" debe ser un número positivo`,
          });
        }
      }
    }

    if (date) {
      for (const field of date) {
        const value = req.body.sanitizedInput[field];
        if (value !== undefined && isNaN(new Date(value).getTime())) {
          return res.status(400).json({
            message: `El campo "${field}" debe ser una fecha válida`,
          });
        }
      }
    }

    if (dateRange) {
      const { startDate, endDate } = dateRange;

      const startDateValue = req.body.sanitizedInput[startDate];
      const endDateValue = req.body.sanitizedInput[endDate];
      const currentDate = formatDateToDash(new Date());

      if (isBefore(startDateValue, currentDate)) {
        return res.status(400).json({
          message: 'La fecha de inicio debe ser mayor o igual a hoy',
        });
      }
      if (isAfter(startDateValue, endDateValue)) {
        return res.status(400).json({
          message: 'La fecha de fin debe ser posterior a la de inicio',
        });
      }
    }

    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      for (const field of email) {
        const value = req.body.sanitizedInput[field];
        if (value !== undefined && !emailRegex.test(value)) {
          return res.status(400).json({
            message: `El campo "${field}" debe ser una dirección de correo electrónico válida`,
          });
        }
      }
    }

    if (role) {
      if (!role.includes(req.body.sanitizedInput.role)) {
        return res.status(400).json({
          message: `El rol no existe. Los roles válidos son: ${role.join(
            ', '
          )}`,
        });
      }
    }

    if (match) {
      for (const [field1, field2] of Object.entries(match)) {
        if (req.body[field1] !== req.body[field2]) {
          return res.status(400).json({
            message: `Las contraseñas deben coincidir.`,
          });
        }
      }
    }

    if (unique && entity) {
      try {
        const id = Number.parseInt(req.params.id);
        for (const field of unique) {
          const uniqueValue = req.body.sanitizedInput[field].trim();
          if (uniqueValue !== undefined) {
            const existingEntity = await em.findOne(entity, {
              [field]: uniqueValue,
            });
            if (existingEntity && (existingEntity as BaseEntity)?.id !== id) {
              return res.status(400).json({
                message:
                  'Se ha detectado un valor repetido que debería ser único.',
              });
            }
          }
        }
      } catch (error) {
        res.status(500).json({ message: 'Error de conexión' });
      }
    }

    next();
  };
};
