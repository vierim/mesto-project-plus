import { Request, Response } from "express";

import mongoose from "mongoose";
import User from "../models/user";

import { ERROR_CODE } from "../utils/constants";
import { ICustomRequest } from "types";

export const getUsers = (_req: Request, res: Response) => {
  return User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const getUserById = (req: Request, res: Response) => {
  const id = req.params.userId;

  return User.findById(id)
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });

    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(ERROR_CODE.BAD_REQUEST).send({
        message: "Переданы некорректные данные при создании пользователя",
      });
    }

    return res
      .status(ERROR_CODE.DEFAULT)
      .send({ message: "Произошла ошибка на стороне сервера" });
  }
};

export const updateProfile = (req: ICustomRequest, res: Response) => {
  const { name, about } = req.body;

  if (req.user) {
    const id = req?.user._id;
    return User.findByIdAndUpdate(
      id,
      { name, about },
      { returnDocument: "after" }
    )
      .then((user) => res.send(user))
      .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
  }
};

export const updateAvatar = (req: ICustomRequest, res: Response) => {
  const { avatar } = req.body;

  if (req.user) {
    const id = req?.user._id;
    return User.findByIdAndUpdate(id, { avatar }, { returnDocument: "after" })
      .then((user) => res.send(user))
      .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
  }
};
