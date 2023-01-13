import { Request, Response } from "express";

import Card from "../models/card";

import { STATUS_CODE } from "../utils/constants";
import { ICustomRequest } from "types";

export const getCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({});

    return res.status(STATUS_CODE.OK).send(cards);
  } catch {
    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: "Произошла ошибка на стороне сервера" });
  }
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

export const addLikeToCard = (req: ICustomRequest, res: Response) => {
  const cardId = req.params.cardId;

  if (req.user) {
    const id = req?.user._id;

    return Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: id } },
      { new: true }
    )
      .then((card) => res.send(card))
      .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
  }
};

export const deleteLikeFromCard = (req: ICustomRequest, res: Response) => {
  const cardId = req.params.cardId;

  if (req.user) {
    const id = req.user._id;

    return Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: id as any } }, // избавить от записи 'as any'
      { new: true }
    )
      .then((card) => res.send(card))
      .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
  }
};
