import { Request, Response } from "express";
import Card from "../models/card";

import { ICustomRequest } from "types";

export const getCards = (_req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createCard = (req: ICustomRequest, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user ? req.user._id : undefined;

  return Card.create({ name, link, owner })
    .then((card) => res.send({ card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const deleteCard = (req: Request, res: Response) => {
  const id = req.params.cardId;

  return Card.findByIdAndDelete(id)
    .then((card) => res.send({ card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
