import { Request, Response } from "express";

import mongoose from "mongoose";
import User from "../models/user";

import { STATUS_CODE } from "../utils/constants";
import { ICustomRequest } from "types";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({});

    return res.status(STATUS_CODE.OK).send(users);
  } catch {
    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: "Произошла ошибка на стороне сервера" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: "Переданы некорректные данные при создании пользователя",
      });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: "Произошла ошибка на стороне сервера" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("Пользователь с таким id не найден");
      error.name = "UserNotFound";

      throw error;
    }

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === "UserNotFound") {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: "Пользователь по указанному _id не найден" });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: "Произошла ошибка на стороне сервера" });
  }
};

export const updateProfile = async (req: ICustomRequest, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new Error("User _id is undefined");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true }
    );

    if (!user) {
      const error = new Error("Пользователь с таким id не найден");
      error.name = "UserNotFound";

      throw error;
    }

    return res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: "Переданы некорректные данные при обновлении профиля",
      });
    }

    if (error instanceof Error && error.name === "UserNotFound") {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: "Пользователь по указанному _id не найден" });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: "Произошла ошибка на стороне сервера" });
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
