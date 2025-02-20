// Express
import express from 'express';

// MikroORM
import { RequestContext } from '@mikro-orm/core';
import { orm, syncSchema } from './shared/database/orm.js';

// Routes
import { routes } from './routes.js';

// Configuration
import { FRONTEND_URL, BACKEND_URL } from './config.js';

// External Libraries
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());

app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, Accept-Language, Accept-Encoding'
  );

  RequestContext.create(orm.em, next);
});

app.get('/api/config', (_, res) => {
  res.json({ imageServerUrl: BACKEND_URL });
});

Object.entries(routes).forEach(([path, router]) => {
  app.use(`/api/${path}`, router);
});

app.use((_, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

await syncSchema();

export { app };
