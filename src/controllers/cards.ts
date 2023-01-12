import { Request, Response } from "express";
import Card from "../models/card";

export const getCards = (_req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;

  return Card.create({ name, link })
    .then((card) => res.send({ card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

export const deleteCard = (req: Request, res: Response) => {
  const id = req.params.cardId;

  return Card.findByIdAndDelete(id)
    .then((card) => res.send({ card }))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};
