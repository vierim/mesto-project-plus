import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

import { requestLogger, errorLogger } from './middlewares/logger';

import { login, createUser } from './controllers/users';
import auth from './middlewares/auth';

import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

dotenv.config();

const { PORT, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());

mongoose.set('runValidators', true);
mongoose.connect(MONGO_URL);

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger);

app.listen(PORT, () => {});
