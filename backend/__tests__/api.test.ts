// App
import { app } from '../src/app.js';

// MikroORM
import { orm } from '../src/shared/database/orm.js';

// Entities
import { Brand } from '../src/core/brand/brand.entity.js';
import { Category } from '../src/core/category/category.entity.js';
import { Color } from '../src/core/color/color.entity.js';
import { Location } from '../src/core/location/location.entity.js';
import { Reminder } from '../src/core/reminder/reminder.entity.js';
import { Reservation } from '../src/core/reservation/reservation.entity.js';
import { User } from '../src/core/user/user.entity.js';
import { Vehicle } from '../src/core/vehicle/vehicle.entity.js';
import { VehicleModel } from '../src/core/vehicle-model/vehicle-model.entity.js';

// Configuration
import { BACKEND_URL } from '../src/config.js';

// Utils
import {
  formatDateToDash,
  fromDashToSlash,
} from '../src/shared/utils/format-date.js';

// External Libraries
import bcrypt from 'bcrypt';
import { addDays, addMonths, addWeeks, subDays, subYears } from 'date-fns';

// Testing (Jest & Supertest)
import { describe, it, expect, afterAll, beforeAll } from '@jest/globals';
import request from 'supertest';

let adminToken: string = '';
let clientToken: string = '';
let createdEntitiesIDs: Record<string, number> = {};

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash('admin', 10);
  const em = orm.em.fork();
  em.create(User, {
    email: 'admin@admin.com',
    password: hashedPassword,
    role: 'admin',
    documentType: 'DNI',
    documentID: '12345678',
    userName: 'Admin',
    userSurname: 'Admin',
    birthDate: formatDateToDash(subYears(new Date(), 30)),
    address: 'Admin 123',
    phoneNumber: '3419876543',
    nationality: 'Argentina',
    verified: true,
  });
  await em.flush();
  const createdAdminUser = await em.findOne(User, { email: 'admin@admin.com' });
  createdEntitiesIDs['adminUser'] = createdAdminUser?.id || 0;
});

describe('App Endpoints', () => {
  it('should return imageServerUrl (BACKEND_URL) (GET)', async () => {
    const response = await request(app).get('/api/config');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ imageServerUrl: BACKEND_URL });
  });

  it('should return 404 status code when route does not exist (GET)', async () => {
    const response = await request(app).get('/api/invalid-route');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Resource not found' });
  });
});

describe('User Endpoints', () => {
  it('should not be able to login with incorrect credentials (POST)', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'admin@admin.com',
      password: 'admin123',
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: 'El email y/o la contraseña son incorrectos',
    });
  });

  it('should login with correct credentials (as an admin) (POST)', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'admin@admin.com',
      password: 'admin',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Inicio de sesión exitoso',
    });
    adminToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('should return the id of the authenticated user (POST)', async () => {
    const response = await request(app)
      .post('/api/users/authenticated-id')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: createdEntitiesIDs['adminUser'] });
  });

  it('should return the role of the authenticated user (POST)', async () => {
    const response = await request(app)
      .post('/api/users/authenticated-role')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ role: 'admin' });
  });

  it('should create a new client user with correct payload (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'pedro.gomez24@gmail.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '43768128',
        userName: 'Pedro',
        userSurname: 'Gomez',
        birthDate: '2003-09-24',
        address: 'Corrientes 1193',
        phoneNumber: '3415463218',
        nationality: 'Argentina',
        verified: false,
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'El usuario ha sido registrado exitosamente',
    });
    const em = orm.em.fork();
    const createdClientUser = await em.findOne(User, {
      email: 'pedro.gomez24@gmail.com',
    });
    createdEntitiesIDs['clientUser1'] = createdClientUser?.id || 0;
  });

  it("should not be able to login directly when the user's account is not verified (as a client) (POST)", async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'pedro.gomez24@gmail.com',
      password: '123456',
    });
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: 'Cuenta no verificada',
    });
  });

  it('should return 400 status code when required information is not provided (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'leonardo.perez@gmail.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '41521790',
        userName: 'Leonardo',
        userSurname: 'Perez',
        birthDate: '2001-06-05',
        address: 'Pellegrini 3527',
        phoneNumber: '341354659',
        verified: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): nationality',
    });
  });

  it('should return 400 status code when birthDate is not in the expected format (yyyy-mm-dd) (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'leonardo.perez@gmail.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '41521790',
        userName: 'Leonardo',
        userSurname: 'Perez',
        birthDate: 'Tuesday, June 5th, 2001',
        address: 'Pellegrini 3527',
        phoneNumber: '341354659',
        nationality: 'Argentina',
        verified: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'El campo "birthDate" debe ser una fecha válida',
    });
  });

  it('should return 400 status code when email is not in the expected format (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'leonardo.perez.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '41521790',
        userName: 'Leonardo',
        userSurname: 'Perez',
        birthDate: '2001-06-05',
        address: 'Pellegrini 3527',
        phoneNumber: '341354659',
        nationality: 'Argentina',
        verified: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'El campo "email" debe ser una dirección de correo electrónico válida',
    });
  });

  it('should return 400 status code when role is not valid (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'leonardo.perez@gmail.com',
        password: '123456',
        role: 'guest',
        documentType: 'DNI',
        documentID: '41521790',
        userName: 'Leonardo',
        userSurname: 'Perez',
        birthDate: '2001-06-05',
        address: 'Pellegrini 3527',
        phoneNumber: '341354659',
        nationality: 'Argentina',
        verified: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: `El rol no existe. Los roles válidos son: admin, employee, client`,
    });
  });

  it('should return 400 status code when email already exists (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'pedro.gomez24@gmail.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '40326731',
        userName: 'Pedro',
        userSurname: 'Gomez',
        birthDate: '1998-02-13',
        address: 'Rioja 1892',
        phoneNumber: '3417432549',
        nationality: 'Argentina',
        verified: false,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return 400 status code when documentID already exists (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'elias.reyes@gmail.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '43768128',
        userName: 'Elias',
        userSurname: 'Reyes',
        birthDate: '2003-08-17',
        address: 'Chacabuco 2146',
        phoneNumber: '3419087624',
        nationality: 'Argentina',
        verified: true,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return true when email exists (as an admin) (GET)', async () => {
    const response = await request(app)
      .get('/api/users/email-exists/pedro.gomez24@gmail.com')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when email does not exist (as an admin) (GET)', async () => {
    const response = await request(app)
      .get('/api/users/email-exists/leonardo.perez@gmail.com')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return true when documentID exists (as an admin) (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/users/document-id-exists/43768128/${
          createdEntitiesIDs['clientUser1'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when documentID exists, but the user id matches with the one passed in the parameters (as an admin) (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/users/document-id-exists/43768128/${createdEntitiesIDs['clientUser1']}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return false when documentID does not exist (as an admin) (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/users/document-id-exists/41521790/${
          createdEntitiesIDs['clientUser1'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return all users as an array (as an admin) (GET)', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual(
      'Todos los usuarios han sido encontrados'
    );
    expect(response.body.data).toBeInstanceOf(Array);
  });

  it('should return 401 status code when token is not provided (GET)', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(401);
  });

  it('should return a single user by ID (as an admin) (GET)', async () => {
    const response = await request(app)
      .get(`/api/users/${createdEntitiesIDs['clientUser1']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El usuario ha sido encontrado',
      data: {
        id: createdEntitiesIDs['clientUser1'],
        email: 'pedro.gomez24@gmail.com',
        password: expect.any(String),
        role: 'client',
        documentType: 'DNI',
        documentID: '43768128',
        userName: 'Pedro',
        userSurname: 'Gomez',
        birthDate: '2003-09-24',
        address: 'Corrientes 1193',
        phoneNumber: '3415463218',
        nationality: 'Argentina',
        verified: false,
      },
    });
  });

  it('should return 404 status code when user does not exist (as an admin) (GET)', async () => {
    const response = await request(app)
      .get(`/api/users/${createdEntitiesIDs['clientUser1'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Usuario no encontrado' });
  });

  it('should update a user with correct payload (as an admin) (PUT)', async () => {
    const response = await request(app)
      .put(`/api/users/${createdEntitiesIDs['clientUser1']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'pedro.gomez24@gmail.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '43768128',
        userName: 'Pedro',
        userSurname: 'Gomez',
        birthDate: '2003-09-24',
        address: 'Juan Manuel de Rosas 3128',
        phoneNumber: '3415463218',
        nationality: 'Argentina',
        verified: false,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El usuario ha sido actualizado exitosamente',
    });
  });

  it('should return 404 status code when user does not exist (as an admin) (PUT)', async () => {
    const response = await request(app)
      .put(`/api/users/${createdEntitiesIDs['clientUser1'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        email: 'pedrogomez24@gmail.com',
        password: '123456',
        role: 'client',
        documentType: 'DNI',
        documentID: '43768129',
        userName: 'Pedro',
        userSurname: 'Gomez',
        birthDate: '2003-09-24',
        address: 'Juan Manuel de Rosas 2891',
        phoneNumber: '3415463218',
        nationality: 'Argentina',
        verified: false,
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Usuario no encontrado' });
  });

  it('should register a new client user with correct payload as a guest (as a client) (POST)', async () => {
    const response = await request(app).post('/api/users/register').send({
      email: 'pedro.gomez25@gmail.com',
      password: '123456',
      documentType: 'DNI',
      documentID: '43768129',
      userName: 'Pedro',
      userSurname: 'Gomez',
      birthDate: '2003-09-24',
      address: 'Corrientes 1193',
      phoneNumber: '3415463218',
      nationality: 'Argentina',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Registro exitoso',
    });
    const em = orm.em.fork();
    const createdClientUser = await em.findOne(User, {
      email: 'pedro.gomez25@gmail.com',
    });
    createdEntitiesIDs['clientUser2'] = createdClientUser?.id || 0;
    if (createdClientUser) {
      em.assign(createdClientUser, { verified: true });
      await em.flush();
    }
  });

  it('should login with correct credentials (as a client) (POST)', async () => {
    const response = await request(app).post('/api/users/login').send({
      email: 'pedro.gomez25@gmail.com',
      password: '123456',
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Inicio de sesión exitoso',
    });
    clientToken = response.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });
});

describe('Brand Endpoints', () => {
  it('should create a new brand with correct payload (POST)', async () => {
    const response = await request(app)
      .post('/api/brands')
      .set('Cookie', `access_token=${adminToken}`)
      .send({ brandName: 'Ford' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'La marca ha sido registrada exitosamente',
    });
    const em = orm.em.fork();
    const createdBrand = await em.findOne(Brand, { brandName: 'Ford' });
    createdEntitiesIDs['brand'] = createdBrand?.id || 0;
  });

  it('should return 400 status code when required information is not provided (POST)', async () => {
    const response = await request(app)
      .post('/api/brands')
      .set('Cookie', `access_token=${adminToken}`)
      .send();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): brandName',
    });
  });

  it('should return 400 status code when brandName already exists (POST)', async () => {
    const response = await request(app)
      .post('/api/brands')
      .set('Cookie', `access_token=${adminToken}`)
      .send({ brandName: 'Ford' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return true when brandName exists (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/brands/brand-name-exists/Ford/${createdEntitiesIDs['brand'] + 1}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when brandName exists, but the brand id matches with the one passed in the parameters (GET)', async () => {
    const response = await request(app)
      .get(`/api/brands/brand-name-exists/Ford/${createdEntitiesIDs['brand']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return false when brandName does not exist (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/brands/brand-name-exists/Audi/${createdEntitiesIDs['brand'] + 1}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return all brands as an array (GET)', async () => {
    const response = await request(app)
      .get('/api/brands')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todas las marcas han sido encontradas',
      data: [{ id: createdEntitiesIDs['brand'], brandName: 'Ford' }],
    });
  });

  it('should return 401 status code when token is not provided (GET)', async () => {
    const response = await request(app).get('/api/brands');
    expect(response.status).toBe(401);
  });

  it('should return a single brand by ID (GET)', async () => {
    const response = await request(app)
      .get(`/api/brands/${createdEntitiesIDs['brand']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La marca ha sido encontrada',
      data: { id: createdEntitiesIDs['brand'], brandName: 'Ford' },
    });
  });

  it('should return 404 status code when brand does not exist (GET)', async () => {
    const response = await request(app)
      .get(`/api/brands/${createdEntitiesIDs['brand'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Marca no encontrada' });
  });

  it('should update a brand with correct payload (PUT)', async () => {
    const response = await request(app)
      .put(`/api/brands/${createdEntitiesIDs['brand']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({ brandName: 'Bentley' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La marca ha sido actualizada exitosamente',
    });
  });

  it('should return 400 status code when required information is not provided (PUT)', async () => {
    const response = await request(app)
      .put(`/api/brands/${createdEntitiesIDs['brand']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): brandName',
    });
  });

  it('should return 404 status code when brand does not exist (PUT)', async () => {
    const response = await request(app)
      .put(`/api/brands/${createdEntitiesIDs['brand'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({ brandName: 'Toyota' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Marca no encontrada' });
  });
});

describe('Category Endpoints', () => {
  it('should create a new category with correct payload (POST)', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        categoryName: 'Deportivo Compacto',
        categoryDescription: 'Diseño deportivo, ideal para ciudad',
        pricePerDay: 250,
        depositValue: 300,
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'La categoría ha sido registrada exitosamente',
    });
    const em = orm.em.fork();
    const createdCategory = await em.findOne(Category, {
      categoryName: 'Deportivo Compacto',
    });
    createdEntitiesIDs['category'] = createdCategory?.id || 0;
  });

  it('should return 400 status code when required information is not provided (POST)', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        categoryName: 'Automóvil Mediano',
        pricePerDay: 80,
        depositValue: 120,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'Toda la información es requerida. Falta(n): categoryDescription',
    });
  });

  it('should return 400 status code when pricePerDay is negative (POST)', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        categoryName: 'Automóvil Mediano',
        categoryDescription: 'Tamaño familiar',
        pricePerDay: -10,
        depositValue: 120,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'El campo "pricePerDay" debe ser un número positivo',
    });
  });

  it('should return 400 status code when categoryName already exists (POST)', async () => {
    const response = await request(app)
      .post('/api/categories')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        categoryName: 'Deportivo Compacto',
        categoryDescription: 'Vehículos de última generación',
        pricePerDay: 180,
        depositValue: 230,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return true when categoryName exists (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/categories/category-name-exists/Deportivo Compacto/${
          createdEntitiesIDs['category'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when categoryName exists, but the category id matches with the one passed in the parameters (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/categories/category-name-exists/Deportivo Compacto/${createdEntitiesIDs['category']}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return false when categoryName does not exist (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/categories/category-name-exists/Camioneta/${
          createdEntitiesIDs['category'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return all categories as an array (GET)', async () => {
    const response = await request(app)
      .get('/api/categories')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todas las categorías han sido encontradas',
      data: [
        {
          id: createdEntitiesIDs['category'],
          categoryName: 'Deportivo Compacto',
          categoryDescription: 'Diseño deportivo, ideal para ciudad',
          pricePerDay: 250,
          depositValue: 300,
        },
      ],
    });
  });

  it('should return 401 status code when token is not provided (GET)', async () => {
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(401);
  });

  it('should return a single category by ID (GET)', async () => {
    const response = await request(app)
      .get(`/api/categories/${createdEntitiesIDs['category']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La categoría ha sido encontrada',
      data: {
        id: createdEntitiesIDs['category'],
        categoryName: 'Deportivo Compacto',
        categoryDescription: 'Diseño deportivo, ideal para ciudad',
        pricePerDay: 250,
        depositValue: 300,
      },
    });
  });

  it('should return 404 status code when category does not exist (GET)', async () => {
    const response = await request(app)
      .get(`/api/categories/${createdEntitiesIDs['category'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Categoría no encontrada' });
  });

  it('should update a category with correct payload (PUT)', async () => {
    const response = await request(app)
      .put(`/api/categories/${createdEntitiesIDs['category']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        categoryName: 'Deportivo',
        categoryDescription: 'Vehículos de última generación',
        pricePerDay: 200,
        depositValue: 270,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La categoría ha sido actualizada exitosamente',
    });
  });

  it('should return 400 status code when required information is not provided (PUT)', async () => {
    const response = await request(app)
      .put(`/api/categories/${createdEntitiesIDs['category']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        categoryName: 'Deportivo Compacto',
        categoryDescription: 'Vehículos de última generación',
        depositValue: 250,
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): pricePerDay',
    });
  });

  it('should return 404 status code when category does not exist (PUT)', async () => {
    const response = await request(app)
      .put(`/api/categories/${createdEntitiesIDs['category'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        categoryName: 'Automóvil Mediano',
        categoryDescription: 'Tamaño familiar',
        pricePerDay: 180,
        depositValue: 250,
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Categoría no encontrada' });
  });
});

describe('Color Endpoints', () => {
  it('should create a new color with correct payload (POST)', async () => {
    const response = await request(app)
      .post('/api/colors')
      .set('Cookie', `access_token=${adminToken}`)
      .send({ colorName: 'Azul' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'El color ha sido registrado exitosamente',
    });
    const em = orm.em.fork();
    const createdColor = await em.findOne(Color, {
      colorName: 'Azul',
    });
    createdEntitiesIDs['color'] = createdColor?.id || 0;
  });

  it('should return 400 status code when required information is not provided (POST)', async () => {
    const response = await request(app)
      .post('/api/colors')
      .set('Cookie', `access_token=${adminToken}`)
      .send();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): colorName',
    });
  });

  it('should return 400 status code when colorName already exists (POST)', async () => {
    const response = await request(app)
      .post('/api/colors')
      .set('Cookie', `access_token=${adminToken}`)
      .send({ colorName: 'Azul' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return true when colorName exists (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/colors/color-name-exists/Azul/${createdEntitiesIDs['color'] + 1}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when colorName exists, but the color id matches with the one passed in the parameters (GET)', async () => {
    const response = await request(app)
      .get(`/api/colors/color-name-exists/Azul/${createdEntitiesIDs['color']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return false when colorName does not exist (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/colors/color-name-exists/Rojo/${
          createdEntitiesIDs['category'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return all colors as an array (GET)', async () => {
    const response = await request(app)
      .get('/api/colors')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todos los colores han sido encontrados',
      data: [{ id: createdEntitiesIDs['color'], colorName: 'Azul' }],
    });
  });

  it('should return 401 status code when token is not provided (GET)', async () => {
    const response = await request(app).get('/api/colors');
    expect(response.status).toBe(401);
  });

  it('should return a single color by ID (GET)', async () => {
    const response = await request(app)
      .get(`/api/colors/${createdEntitiesIDs['color']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El color ha sido encontrado',
      data: { id: createdEntitiesIDs['color'], colorName: 'Azul' },
    });
  });

  it('should return 404 status code when color does not exist (GET)', async () => {
    const response = await request(app)
      .get(`/api/colors/${createdEntitiesIDs['color'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Color no encontrado' });
  });

  it('should update a color with correct payload (PUT)', async () => {
    const response = await request(app)
      .put(`/api/colors/${createdEntitiesIDs['color']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({ colorName: 'Negro' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El color ha sido actualizado exitosamente',
    });
  });

  it('should return 400 status code when required information is not provided (PUT)', async () => {
    const response = await request(app)
      .put(`/api/colors/${createdEntitiesIDs['color']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send();
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): colorName',
    });
  });

  it('should return 404 status code when color does not exist (PUT)', async () => {
    const response = await request(app)
      .put(`/api/colors/${createdEntitiesIDs['color'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({ colorName: 'Rojo' });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Color no encontrado' });
  });
});

describe('Location Endpoints', () => {
  it('should create a new location with correct payload (POST)', async () => {
    const response = await request(app)
      .post('/api/locations')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        locationName: 'Sur',
        address: 'Presidente Roca 4285',
        phoneNumber: '3417453849',
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'La sucursal ha sido registrada exitosamente',
    });
    const em = orm.em.fork();
    const createdLocation = await em.findOne(Location, {
      locationName: 'Sur',
    });
    createdEntitiesIDs['location'] = createdLocation?.id || 0;
  });

  it('should return 400 status code when required information is not provided (POST)', async () => {
    const response = await request(app)
      .post('/api/locations')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        locationName: 'Centro',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'Toda la información es requerida. Falta(n): address, phoneNumber',
    });
  });

  it('should return 400 status code when locationName already exists (POST)', async () => {
    const response = await request(app)
      .post('/api/locations')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        locationName: 'Sur',
        address: 'Ovidio Lagos 4927',
        phoneNumber: '3413546547',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return true when locationName exists (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/locations/location-name-exists/Sur/${
          createdEntitiesIDs['location'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when locationName exists, but the location id matches with the one passed in the parameters (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/locations/location-name-exists/Sur/${createdEntitiesIDs['location']}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return false when locationName does not exist (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/locations/location-name-exists/Centro/${
          createdEntitiesIDs['location'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return all locations as an array (GET)', async () => {
    const response = await request(app)
      .get('/api/locations')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todas las sucursales han sido encontradas',
      data: [
        {
          id: createdEntitiesIDs['location'],
          locationName: 'Sur',
          address: 'Presidente Roca 4285',
          phoneNumber: '3417453849',
        },
      ],
    });
  });

  it('should return 401 status code when token is not provided (GET)', async () => {
    const response = await request(app).get('/api/locations');
    expect(response.status).toBe(401);
  });

  it('should return a single location by ID (GET)', async () => {
    const response = await request(app)
      .get(`/api/locations/${createdEntitiesIDs['location']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La sucursal ha sido encontrada',
      data: {
        id: createdEntitiesIDs['location'],
        locationName: 'Sur',
        address: 'Presidente Roca 4285',
        phoneNumber: '3417453849',
      },
    });
  });

  it('should return 404 status code when location does not exist (GET)', async () => {
    const response = await request(app)
      .get(`/api/locations/${createdEntitiesIDs['location'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Sucursal no encontrada' });
  });

  it('should update a location with correct payload (PUT)', async () => {
    const response = await request(app)
      .put(`/api/locations/${createdEntitiesIDs['location']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        locationName: 'Sur',
        address: 'La Paz 1367',
        phoneNumber: '3417453849',
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La sucursal ha sido actualizada exitosamente',
    });
  });

  it('should return 400 status code when required information is not provided (PUT)', async () => {
    const response = await request(app)
      .put(`/api/locations/${createdEntitiesIDs['location']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        locationName: 'Sur',
        address: 'Riobamba 1624',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): phoneNumber',
    });
  });

  it('should return 404 status code when location does not exist (PUT)', async () => {
    const response = await request(app)
      .put(`/api/locations/${createdEntitiesIDs['location'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        locationName: 'Centro',
        address: 'Paraguay 926',
        phoneNumber: '3412315467',
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Sucursal no encontrada' });
  });
});

describe('Vehicle Model Endpoints', () => {
  it('should create a new vehicle model with correct payload (POST)', async () => {
    const response = await request(app)
      .post('/api/vehicle-models')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        vehicleModelName: 'Mulliner Batur',
        transmissionType: 'Manual',
        passengerCount: 4,
        imagePath: '1736293861463-bentley_mulliner_batur.jpg',
        category: createdEntitiesIDs['category'],
        brand: createdEntitiesIDs['brand'],
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'El modelo ha sido registrado exitosamente',
    });
    const em = orm.em.fork();
    const createdVehicleModel = await em.findOne(VehicleModel, {
      vehicleModelName: 'Mulliner Batur',
    });
    createdEntitiesIDs['vehicleModel'] = createdVehicleModel?.id || 0;
  });

  it('should return 400 status code when required information is not provided (POST)', async () => {
    const response = await request(app)
      .post('/api/vehicle-models')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        vehicleModelName: 'Portofino',
        transmissionType: 'Automatica',
        category: createdEntitiesIDs['category'],
        brand: createdEntitiesIDs['brand'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'Toda la información es requerida. Falta(n): passengerCount, imagePath',
    });
  });

  it('should return 400 status code when vehicleModelName already exists (POST)', async () => {
    const response = await request(app)
      .post('/api/vehicle-models')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        vehicleModelName: 'Mulliner Batur',
        transmissionType: 'Automatica',
        passengerCount: 5,
        imagePath: '1736293869472-bentley_mulliner_batur_2.jpg',
        category: createdEntitiesIDs['category'],
        brand: createdEntitiesIDs['brand'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return true when vehicleModelName exists (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/vehicle-models/vehicle-model-name-exists/Mulliner Batur/${
          createdEntitiesIDs['vehicleModel'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when vehicleModelName exists, but the vehicle model id matches with the one passed in the parameters (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/vehicle-models/vehicle-model-name-exists/Mulliner Batur/${createdEntitiesIDs['vehicleModel']}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return false when vehicleModelName does not exist (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/vehicle-models/vehicle-model-name-exists/Portofino/${
          createdEntitiesIDs['vehicleModel'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return all vehicle models as an array (GET)', async () => {
    const response = await request(app)
      .get('/api/vehicle-models')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todos los modelos han sido encontrados',
      data: [
        {
          id: createdEntitiesIDs['vehicleModel'],
          vehicleModelName: 'Mulliner Batur',
          transmissionType: 'Manual',
          passengerCount: 4,
          imagePath: '1736293861463-bentley_mulliner_batur.jpg',
          category: expect.objectContaining({
            id: createdEntitiesIDs['category'],
            categoryName: 'Deportivo',
            categoryDescription: 'Vehículos de última generación',
            pricePerDay: 200,
            depositValue: 270,
          }),
          brand: expect.objectContaining({
            id: createdEntitiesIDs['brand'],
            brandName: 'Bentley',
          }),
        },
      ],
    });
  });

  it('should return 401 status code when token is not provided (GET)', async () => {
    const response = await request(app).get('/api/vehicle-models');
    expect(response.status).toBe(401);
  });

  it('should return a single vehicle model by ID (GET)', async () => {
    const response = await request(app)
      .get(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El modelo ha sido encontrado',
      data: {
        id: createdEntitiesIDs['vehicleModel'],
        vehicleModelName: 'Mulliner Batur',
        transmissionType: 'Manual',
        passengerCount: 4,
        imagePath: '1736293861463-bentley_mulliner_batur.jpg',
        category: expect.objectContaining({
          id: createdEntitiesIDs['category'],
          categoryName: 'Deportivo',
          categoryDescription: 'Vehículos de última generación',
          pricePerDay: 200,
          depositValue: 270,
        }),
        brand: expect.objectContaining({
          id: createdEntitiesIDs['brand'],
          brandName: 'Bentley',
        }),
      },
    });
  });

  it('should return 404 status code when vehicle model does not exist (GET)', async () => {
    const response = await request(app)
      .get(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Modelo no encontrado' });
  });

  it('should update a vehicle model with correct payload (PUT)', async () => {
    const response = await request(app)
      .put(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        vehicleModelName: 'Mulliner Batur',
        transmissionType: 'Automatica',
        passengerCount: 5,
        imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
        category: createdEntitiesIDs['category'],
        brand: createdEntitiesIDs['brand'],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El modelo ha sido actualizado exitosamente',
    });
  });

  it('should return 400 status code when required information is not provided (PUT)', async () => {
    const response = await request(app)
      .put(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        vehicleModelName: 'Mulliner Batur',
        passengerCount: 4,
        imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
        category: createdEntitiesIDs['category'],
        brand: createdEntitiesIDs['brand'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): transmissionType',
    });
  });

  it('should return 404 status code when vehicle model does not exist (PUT)', async () => {
    const response = await request(app)
      .put(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        vehicleModelName: 'Portofino',
        transmissionType: 'Manual',
        passengerCount: 4,
        imagePath: '1736293865418-ferrari_portofino.jpg',
        category: createdEntitiesIDs['category'] + 1,
        brand: createdEntitiesIDs['brand'] + 1,
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Modelo no encontrado' });
  });
});

describe('Vehicle Endpoints', () => {
  it('should create a new vehicle with correct payload (POST)', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        licensePlate: 'BE476MB',
        manufacturingYear: 2024,
        totalKms: 15000,
        location: createdEntitiesIDs['location'],
        color: createdEntitiesIDs['color'],
        vehicleModel: createdEntitiesIDs['vehicleModel'],
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'El vehículo ha sido registrado exitosamente',
    });
    const em = orm.em.fork();
    const createdVehicle = await em.findOne(Vehicle, {
      licensePlate: 'BE476MB',
    });
    createdEntitiesIDs['vehicle'] = createdVehicle?.id || 0;
  });

  it('should return 400 status code when required information is not provided (POST)', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        licensePlate: 'IUD130',
        manufacturingYear: 2021,
        location: createdEntitiesIDs['location'],
        color: createdEntitiesIDs['color'],
        vehicleModel: createdEntitiesIDs['vehicleModel'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): totalKms',
    });
  });

  it('should return 400 status code when licensePlate already exists (POST)', async () => {
    const response = await request(app)
      .post('/api/vehicles')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        licensePlate: 'BE476MB',
        manufacturingYear: 2025,
        totalKms: 0,
        location: createdEntitiesIDs['location'],
        color: createdEntitiesIDs['color'],
        vehicleModel: createdEntitiesIDs['vehicleModel'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Se ha detectado un valor repetido que debería ser único.',
    });
  });

  it('should return true when licensePlate exists (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/vehicles/license-plate-exists/BE476MB/${
          createdEntitiesIDs['vehicle'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: true });
  });

  it('should return false when licensePlate exists, but the vehicle id matches with the one passed in the parameters (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/vehicles/license-plate-exists/BE476MB/${createdEntitiesIDs['vehicle']}`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return false when licensePlate does not exist (GET)', async () => {
    const response = await request(app)
      .get(
        `/api/vehicles/license-plate-exists/IUD130/${
          createdEntitiesIDs['vehicle'] + 1
        }`
      )
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ exists: false });
  });

  it('should return all vehicles as an array (GET)', async () => {
    const response = await request(app)
      .get('/api/vehicles')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todos los vehículos han sido encontrados',
      data: [
        {
          id: createdEntitiesIDs['vehicle'],
          licensePlate: 'BE476MB',
          manufacturingYear: 2024,
          totalKms: 15000,
          location: expect.objectContaining({
            id: createdEntitiesIDs['location'],
            locationName: 'Sur',
            address: 'La Paz 1367',
            phoneNumber: '3417453849',
          }),
          color: expect.objectContaining({
            id: createdEntitiesIDs['color'],
            colorName: 'Negro',
          }),
          vehicleModel: expect.objectContaining({
            id: createdEntitiesIDs['vehicleModel'],
            vehicleModelName: 'Mulliner Batur',
            transmissionType: 'Automatica',
            passengerCount: 5,
            imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
            category: createdEntitiesIDs['category'],
            brand: expect.objectContaining({
              id: createdEntitiesIDs['brand'],
              brandName: 'Bentley',
            }),
          }),
        },
      ],
    });
  });

  it('should return 401 status code when token is not provided (GET)', async () => {
    const response = await request(app).get('/api/vehicles');
    expect(response.status).toBe(401);
  });

  it('should return a single vehicle by ID (GET)', async () => {
    const response = await request(app)
      .get(`/api/vehicles/${createdEntitiesIDs['vehicle']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El vehículo ha sido encontrado',
      data: {
        id: createdEntitiesIDs['vehicle'],
        licensePlate: 'BE476MB',
        manufacturingYear: 2024,
        totalKms: 15000,
        location: expect.objectContaining({
          id: createdEntitiesIDs['location'],
          locationName: 'Sur',
          address: 'La Paz 1367',
          phoneNumber: '3417453849',
        }),
        color: expect.objectContaining({
          id: createdEntitiesIDs['color'],
          colorName: 'Negro',
        }),
        vehicleModel: expect.objectContaining({
          id: createdEntitiesIDs['vehicleModel'],
          vehicleModelName: 'Mulliner Batur',
          transmissionType: 'Automatica',
          passengerCount: 5,
          imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
          category: createdEntitiesIDs['category'],
          brand: expect.objectContaining({
            id: createdEntitiesIDs['brand'],
            brandName: 'Bentley',
          }),
        }),
      },
    });
  });

  it('should return 404 status code when vehicle does not exist (GET)', async () => {
    const response = await request(app)
      .get(`/api/vehicles/${createdEntitiesIDs['vehicle'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Vehículo no encontrado' });
  });

  it('should update a vehicle with correct payload (PUT)', async () => {
    const response = await request(app)
      .put(`/api/vehicles/${createdEntitiesIDs['vehicle']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        licensePlate: 'BE475MB',
        manufacturingYear: 2024,
        totalKms: 20000,
        location: createdEntitiesIDs['location'],
        color: createdEntitiesIDs['color'],
        vehicleModel: createdEntitiesIDs['vehicleModel'],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El vehículo ha sido actualizado exitosamente',
    });
  });

  it('should return 404 status code when vehicle does not exist (PUT)', async () => {
    const response = await request(app)
      .put(`/api/vehicles/${createdEntitiesIDs['vehicle'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        licensePlate: 'BE476MB',
        manufacturingYear: 2024,
        totalKms: 25000,
        location: createdEntitiesIDs['location'],
        color: createdEntitiesIDs['color'],
        vehicleModel: createdEntitiesIDs['vehicleModel'],
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Vehículo no encontrado' });
  });
});

describe('Reservation Endpoints', () => {
  const today: Date = new Date();
  const yesterday: Date = subDays(today, 1);
  const tomorrow: Date = addDays(today, 1);
  const oneWeekAfterTomorrow: Date = addWeeks(tomorrow, 1);
  const nextMonth: Date = addMonths(today, 1);
  const oneWeekAfterNextMonth: Date = addWeeks(nextMonth, 1);

  it('should return an array of available vehicles based on the provided filter (date range and location) (GET)', async () => {
    const response = await request(app)
      .get('/api/vehicles/available')
      .query({
        startDate: formatDateToDash(tomorrow),
        endDate: formatDateToDash(oneWeekAfterTomorrow),
        location: createdEntitiesIDs['location'],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todos los vehículos disponibles han sido encontrados',
      data: [
        {
          id: createdEntitiesIDs['vehicle'],
          licensePlate: 'BE475MB',
          manufacturingYear: 2024,
          totalKms: 20000,
          location: expect.objectContaining({
            id: createdEntitiesIDs['location'],
            locationName: 'Sur',
            address: 'La Paz 1367',
            phoneNumber: '3417453849',
          }),
          color: createdEntitiesIDs['color'],
          vehicleModel: expect.objectContaining({
            id: createdEntitiesIDs['vehicleModel'],
            vehicleModelName: 'Mulliner Batur',
            transmissionType: 'Automatica',
            passengerCount: 5,
            imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
            category: expect.objectContaining({
              id: createdEntitiesIDs['category'],
              categoryName: 'Deportivo',
              categoryDescription: 'Vehículos de última generación',
              pricePerDay: 200,
              depositValue: 270,
            }),
            brand: expect.objectContaining({
              id: createdEntitiesIDs['brand'],
              brandName: 'Bentley',
            }),
          }),
        },
      ],
    });
  });

  it('should return 400 status code if the filter start date is before the current date (GET)', async () => {
    const response = await request(app)
      .get('/api/vehicles/available')
      .query({
        startDate: formatDateToDash(yesterday),
        endDate: formatDateToDash(oneWeekAfterTomorrow),
        location: createdEntitiesIDs['location'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'La fecha de inicio debe ser mayor o igual a hoy',
    });
  });

  it('should return 400 status code if the filter start date is after the filter end date (GET)', async () => {
    const response = await request(app)
      .get('/api/vehicles/available')
      .query({
        startDate: formatDateToDash(oneWeekAfterTomorrow),
        endDate: formatDateToDash(tomorrow),
        location: createdEntitiesIDs['location'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'La fecha de fin debe ser posterior a la de inicio',
    });
  });

  it('should create a new reservation with correct payload (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/reservations/create-admin-reservation')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        reservationDate: formatDateToDash(today),
        startDate: formatDateToDash(tomorrow),
        plannedEndDate: formatDateToDash(oneWeekAfterTomorrow),
        user: createdEntitiesIDs['clientUser1'],
        vehicle: createdEntitiesIDs['vehicle'],
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Reserva exitosa',
    });
    const em = orm.em.fork();
    const createdAdminReservation = await em.findOne(
      Reservation,
      {
        reservationDate: formatDateToDash(today),
        startDate: formatDateToDash(tomorrow),
        plannedEndDate: formatDateToDash(oneWeekAfterTomorrow),
        user: createdEntitiesIDs['clientUser1'],
        vehicle: createdEntitiesIDs['vehicle'],
      },
      { populate: ['reminders'] }
    );
    if (createdAdminReservation) {
      createdEntitiesIDs['adminReservation'] = createdAdminReservation.id || 0;
      if (createdAdminReservation.reminders[0]) {
        createdEntitiesIDs['reminder'] =
          createdAdminReservation.reminders[0].id || 0;
        em.assign(createdAdminReservation.reminders[0], { sent: true });
        await em.flush();
      }
    }
  });

  it('should return 400 status code when required information is not provided (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/reservations/create-admin-reservation')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        reservationDate: formatDateToDash(today),
        startDate: formatDateToDash(tomorrow),
        user: createdEntitiesIDs['clientUser1'],
        vehicle: createdEntitiesIDs['vehicle'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'Toda la información es requerida. Falta(n): plannedEndDate',
    });
  });

  it('should return 400 status code when selected vehicle is no longer available for the date range (as an admin) (POST)', async () => {
    const response = await request(app)
      .post('/api/reservations/create-admin-reservation')
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        reservationDate: formatDateToDash(today),
        startDate: formatDateToDash(tomorrow),
        plannedEndDate: formatDateToDash(oneWeekAfterTomorrow),
        user: createdEntitiesIDs['clientUser1'],
        vehicle: createdEntitiesIDs['vehicle'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'El vehículo ya no está disponible para las fechas seleccionadas. Por favor, seleccione otro vehículo o intente con otro rango de fechas.',
    });
  });

  it('should return all reservations as an array (as an admin) (GET)', async () => {
    const response = await request(app)
      .get('/api/reservations')
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todas las reservas han sido encontradas',
      data: [
        {
          id: createdEntitiesIDs['adminReservation'],
          reservationDate: formatDateToDash(today),
          startDate: formatDateToDash(tomorrow),
          plannedEndDate: formatDateToDash(oneWeekAfterTomorrow),
          realEndDate: null,
          cancellationDate: null,
          initialKms: null,
          finalKms: null,
          finalPrice: null,
          user: expect.objectContaining({
            id: createdEntitiesIDs['clientUser1'],
            email: 'pedro.gomez24@gmail.com',
            password: expect.any(String),
            role: 'client',
            documentType: 'DNI',
            documentID: '43768128',
            userName: 'Pedro',
            userSurname: 'Gomez',
            birthDate: '2003-09-24',
            address: 'Juan Manuel de Rosas 3128',
            phoneNumber: '3415463218',
            nationality: 'Argentina',
            verified: false,
          }),
          vehicle: expect.objectContaining({
            id: createdEntitiesIDs['vehicle'],
            licensePlate: 'BE475MB',
            manufacturingYear: 2024,
            totalKms: 20000,
            location: createdEntitiesIDs['location'],
            color: createdEntitiesIDs['color'],
            vehicleModel: expect.objectContaining({
              id: createdEntitiesIDs['vehicleModel'],
              vehicleModelName: 'Mulliner Batur',
              transmissionType: 'Automatica',
              passengerCount: 5,
              imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
              category: expect.objectContaining({
                id: createdEntitiesIDs['category'],
                categoryName: 'Deportivo',
                categoryDescription: 'Vehículos de última generación',
                pricePerDay: 200,
                depositValue: 270,
              }),
              brand: createdEntitiesIDs['brand'],
            }),
          }),
        },
      ],
    });
  });

  it('should return 401 status code when token is not provided (as an admin) (GET)', async () => {
    const response = await request(app).get('/api/reservations');
    expect(response.status).toBe(401);
  });

  it('should be able to do checkin with correct payload (as an admin) (PUT)', async () => {
    const response = await request(app)
      .put(`/api/reservations/${createdEntitiesIDs['adminReservation']}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        initialKms: 20000,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La reserva ha sido actualizada exitosamente',
    });
  });

  it('should return 404 status code when reservation does not exist (checkin as an admin) (PUT)', async () => {
    const response = await request(app)
      .put(`/api/reservations/${createdEntitiesIDs['adminReservation'] + 1}`)
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        initialKms: 20000,
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Reserva no encontrada' });
  });

  it('should return 400 status code when selected vehicle is no longer available for the date range (as a client) (POST)', async () => {
    const response = await request(app)
      .post('/api/reservations/create-user-reservation')
      .set('Cookie', `access_token=${clientToken}`)
      .send({
        reservationDate: formatDateToDash(today),
        startDate: formatDateToDash(tomorrow),
        plannedEndDate: formatDateToDash(oneWeekAfterTomorrow),
        vehicle: createdEntitiesIDs['vehicle'],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'El vehículo ya no está disponible para las fechas seleccionadas. Por favor, seleccione otro vehículo o intente con otro rango de fechas.',
    });
  });

  it('should create a new reservation with correct payload (as a client) (POST)', async () => {
    const response = await request(app)
      .post('/api/reservations/create-user-reservation')
      .set('Cookie', `access_token=${clientToken}`)
      .send({
        reservationDate: formatDateToDash(today),
        startDate: formatDateToDash(nextMonth),
        plannedEndDate: formatDateToDash(oneWeekAfterNextMonth),
        vehicle: createdEntitiesIDs['vehicle'],
      });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: 'Reserva exitosa',
    });
    const em = orm.em.fork();
    const createdClientReservation = await em.findOne(Reservation, {
      reservationDate: formatDateToDash(today),
      startDate: formatDateToDash(nextMonth),
      plannedEndDate: formatDateToDash(oneWeekAfterNextMonth),
      vehicle: createdEntitiesIDs['vehicle'],
    });
    createdEntitiesIDs['clientReservation'] = createdClientReservation?.id || 0;
  });

  it('should return all reservations that belong to the user as an array (as a client) (GET)', async () => {
    const response = await request(app)
      .get('/api/reservations/user-reservations')
      .set('Cookie', `access_token=${clientToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Todas sus reservas han sido encontradas',
      data: [
        {
          id: createdEntitiesIDs['clientReservation'],
          reservationDate: formatDateToDash(today),
          startDate: formatDateToDash(nextMonth),
          plannedEndDate: formatDateToDash(oneWeekAfterNextMonth),
          realEndDate: null,
          cancellationDate: null,
          initialKms: null,
          finalKms: null,
          finalPrice: null,
          user: createdEntitiesIDs['clientUser2'],
          vehicle: expect.objectContaining({
            id: createdEntitiesIDs['vehicle'],
            licensePlate: 'BE475MB',
            manufacturingYear: 2024,
            totalKms: 20000,
            location: createdEntitiesIDs['location'],
            color: createdEntitiesIDs['color'],
            vehicleModel: expect.objectContaining({
              id: createdEntitiesIDs['vehicleModel'],
              vehicleModelName: 'Mulliner Batur',
              transmissionType: 'Automatica',
              passengerCount: 5,
              imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
              category: expect.objectContaining({
                id: createdEntitiesIDs['category'],
                categoryName: 'Deportivo',
                categoryDescription: 'Vehículos de última generación',
                pricePerDay: 200,
                depositValue: 270,
              }),
              brand: expect.objectContaining({
                id: createdEntitiesIDs['brand'],
                brandName: 'Bentley',
              }),
            }),
          }),
        },
      ],
    });
  });

  it('should be able to do checkout with correct payload (as an admin) (PUT)', async () => {
    const response = await request(app)
      .put(
        `/api/reservations/checkout/${createdEntitiesIDs['adminReservation']}`
      )
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        realEndDate: formatDateToDash(oneWeekAfterTomorrow),
        finalKms: 22000,
        finalPrice: 1400,
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Se ha realizado el check-out de la reserva exitosamente',
    });
  });

  it('should return 404 status code when reservation does not exist (checkout as an admin) (PUT)', async () => {
    const response = await request(app)
      .put(
        `/api/reservations/checkout/${
          createdEntitiesIDs['adminReservation'] + 2
        }`
      )
      .set('Cookie', `access_token=${adminToken}`)
      .send({
        realEndDate: formatDateToDash(oneWeekAfterTomorrow),
        finalKms: 22000,
        finalPrice: 1400,
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: 'Reserva no encontrada',
    });
  });
});

describe('DELETE Endpoints with Restrictions', () => {
  it('should not be able to delete a brand that is related with at least one vehicle model (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/brands/${createdEntitiesIDs['brand']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'La marca no se puede eliminar porque tiene modelos asociados.',
    });
  });

  it('should not be able to delete a category that is related with at least one vehicle model (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/categories/${createdEntitiesIDs['category']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'La categoría no se puede eliminar porque tiene modelos asociados.',
    });
  });

  it('should not be able to delete a color that is related with at least one vehicle (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/colors/${createdEntitiesIDs['color']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'El color no se puede eliminar porque tiene vehículos asociados.',
    });
  });

  it('should not be able to delete a location that is related with at least one vehicle (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/locations/${createdEntitiesIDs['location']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'La sucursal no se puede eliminar porque tiene vehiculos asociados.',
    });
  });

  it('should not be able to delete a vehicle model that is related with at least one vehicle (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'El modelo no se puede eliminar porque tiene vehiculos asociados.',
    });
  });

  it('should not be able to delete a vehicle that is related with at least one reservation (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/vehicles/${createdEntitiesIDs['vehicle']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'El vehículo no se puede eliminar porque tiene reservas asociadas.',
    });
  });

  it('should not be able to delete a user that is related with at least one reservation (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdEntitiesIDs['clientUser1']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'El usuario no se puede eliminar porque tiene reservas asociadas.',
    });
  });

  it('should not be able to delete a reservation for which the reminder has already been sent to the client (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/reservations/${createdEntitiesIDs['adminReservation']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message:
        'La reserva no se puede eliminar porque ya se ha enviado un recordatorio al cliente.',
    });
  });
});

describe('DELETE Endpoints', () => {
  it('should delete reservations by ID (DELETE)', async () => {
    const em = orm.em.fork();
    await em.removeAndFlush(
      em.getReference(Reminder, createdEntitiesIDs['reminder'])
    );
    const adminReservationResponse = await request(app)
      .delete(`/api/reservations/${createdEntitiesIDs['adminReservation']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(adminReservationResponse.status).toBe(200);
    expect(adminReservationResponse.body).toEqual({
      message: 'La reserva ha sido eliminada exitosamente',
    });
    const clientReservationResponse = await request(app)
      .delete(`/api/reservations/${createdEntitiesIDs['clientReservation']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(clientReservationResponse.status).toBe(200);
    expect(clientReservationResponse.body).toEqual({
      message: 'La reserva ha sido eliminada exitosamente',
    });
  });

  it('should return 404 status code when reservation does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/reservations/${createdEntitiesIDs['adminReservation']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Reserva no encontrada' });
  });

  it('should delete a user by ID (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdEntitiesIDs['clientUser1']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El usuario ha sido eliminado exitosamente',
    });
  });

  it('should return 404 status code when user does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/users/${createdEntitiesIDs['clientUser1']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Usuario no encontrado' });
  });

  it('should delete a vehicle by ID (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/vehicles/${createdEntitiesIDs['vehicle']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El vehículo ha sido eliminado exitosamente',
    });
  });

  it('should return 404 status code when vehicle does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/vehicles/${createdEntitiesIDs['vehicle']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Vehículo no encontrado' });
  });

  it('should delete a vehicle model by ID (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El modelo ha sido eliminado exitosamente',
      imagePath: '1736293865418-bentley_mulliner_batur_3.jpg',
    });
  });

  it('should return 404 status code when vehicle model does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/vehicle-models/${createdEntitiesIDs['vehicleModel']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Modelo no encontrado' });
  });

  it('should delete a location by ID (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/locations/${createdEntitiesIDs['location']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La sucursal ha sido eliminada exitosamente',
    });
  });

  it('should return 404 status code when location does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/locations/${createdEntitiesIDs['location']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Sucursal no encontrada' });
  });

  it('should delete a color by ID (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/colors/${createdEntitiesIDs['color']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'El color ha sido eliminado exitosamente',
    });
  });

  it('should return 404 status code when color does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/colors/${createdEntitiesIDs['color']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Color no encontrado' });
  });

  it('should delete a category by ID (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/categories/${createdEntitiesIDs['category']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La categoría ha sido eliminada exitosamente',
    });
  });

  it('should return 404 status code when category does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/categories/${createdEntitiesIDs['category']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Categoría no encontrada' });
  });

  it('should delete a brand by ID (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/brands/${createdEntitiesIDs['brand']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'La marca ha sido eliminada exitosamente',
    });
  });

  it('should return 404 status code when brand does not exist (DELETE)', async () => {
    const response = await request(app)
      .delete(`/api/brands/${createdEntitiesIDs['brand']}`)
      .set('Cookie', `access_token=${adminToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Marca no encontrada' });
  });
});

describe('Internal Function', () => {
  it('should return the same date transformed from dash to slash format', () => {
    expect(fromDashToSlash('2025-10-01')).toEqual('01/10/2025');
  });
});

afterAll(async () => {
  await request(app).post('/api/users/logout');
  const em = orm.em.fork();
  await em.removeAndFlush(
    em.getReference(User, createdEntitiesIDs['adminUser'])
  );
  await em.removeAndFlush(
    em.getReference(User, createdEntitiesIDs['clientUser2'])
  );
  orm.close();
});
