import express from "express";
import mongoose from "mongoose";

import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";

const PORT = 3000;

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
