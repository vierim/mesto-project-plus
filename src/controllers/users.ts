import { Request, Response } from "express";
import { ICustomRequest } from "types";
import User from "../models/user";

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

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
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
