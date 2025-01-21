// Express
import { Request, Response, NextFunction } from 'express';

// MikroORM
import { orm } from '../database/orm.js';

// Entities
import { BaseEntity } from '../database/base.entity.js';

// Types
import { Entity } from '../types/custom/entity.type.js';

// External Libraries
import moment from 'moment';

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
          message: `All information is required. Missing: ${missing.join(
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
        if (value !== undefined && (isNaN(value) || value < 1)) {
          return res.status(400).json({
            message: `The field "${field}" must be a positive number.`,
          });
        }
      }
    }

    if (date) {
      for (const field of date) {
        const value = req.body.sanitizedInput[field];
        if (value !== undefined && isNaN(new Date(value).getTime())) {
          return res.status(400).json({
            message: `The field "${field}" must be a valid date.`,
          });
        }
      }
    }

    if (dateRange) {
      const { startDate, endDate } = dateRange;
      const startDateValue = req.body.sanitizedInput[startDate];
      if (moment(startDateValue).isBefore(moment().startOf('day'))) {
        return res.status(400).json({
          message: 'The start date cannot be in the past.',
        });
      }
      const endDateValue = req.body.sanitizedInput[endDate];
      if (moment(startDateValue).isAfter(moment(endDateValue))) {
        return res.status(400).json({
          message: 'The end date cannot be before the start date.',
        });
      }
    }

    if (email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      for (const field of email) {
        const value = req.body.sanitizedInput[field];
        if (value !== undefined && !emailRegex.test(value)) {
          return res.status(400).json({
            message: `The field "${field}" must be a valid email address.`,
          });
        }
      }
    }

    if (role) {
      if (!role.includes(req.body.sanitizedInput.role)) {
        return res.status(400).json({
          message: `Role does not exist. Valid roles are: ${role.join(', ')}.`,
        });
      }
    }

    if (match) {
      for (const [field1, field2] of Object.entries(match)) {
        if (req.body[field1] !== req.body[field2]) {
          return res.status(400).json({
            message: `The fields "${field1}" and "${field2}" must match.`,
          });
        }
      }
    }

    if (unique && entity) {
      const id = Number.parseInt(req.params.id);
      const errors: string[] = [];
      for (const field of unique) {
        const uniqueValue = req.body.sanitizedInput[field];
        if (uniqueValue !== undefined) {
          const existingEntity = await em.findOne(entity, {
            [field]: uniqueValue,
          });
          if (existingEntity && (existingEntity as BaseEntity)?.id !== id) {
            errors.push(`${field} "${uniqueValue}" is already used.`);
          }
        }
      }
      if (errors.length > 0) {
        return res.status(400).json({
          message: errors.join(', '),
        });
      }
    }

    next();
  };
};
