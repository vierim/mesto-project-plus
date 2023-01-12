import express from "express";
import mongoose from "mongoose";

import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";

import { ICustomRequest } from 'types';

const PORT = 3000;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use((req: ICustomRequest, _res, next) => {
  req.user = {
    _id: "63bd2cae9b1fd0974185900f",
  };

  next();
});

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
