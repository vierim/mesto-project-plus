import { NextFunction, Request, Response } from 'express';

import mongoose from 'mongoose';
import { ICustomRequest } from '../types';
import Card from '../models/card';

import STATUS_CODE from '../utils/constants';
import composeErrorMessage from '../utils/helpers';
import { NotFoundError, ForbiddenError, ValidationError } from '../errors';

export const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate('owner', ['name', 'about']);

    return res.status(STATUS_CODE.OK).send(cards);
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user?._id;

  try {
    const card = await Card.create({ name, link, owner: userId });

    return res.status(STATUS_CODE.OK).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const message = composeErrorMessage(error);
      return next(new ValidationError(message));
    }

    return next(error);
  }
};

export const deleteCard = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    const card = await Card.findById(cardId)
      .populate({ path: 'owner', match: { _id: userId } })
      .orFail(new NotFoundError('Карточка с таким id не найдена'));

    if (!card.owner) {
      throw new ForbiddenError('Карточка с таким id принадлежит другому пользователю');
    }

    await Card.findByIdAndDelete(cardId);

    return res.status(STATUS_CODE.OK).send({ message: 'Карточка удалена' });
  } catch (error) {
    return next(error);
  }
};

export const addLikeToCard = async (req: ICustomRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    ).orFail(new NotFoundError('Карточка с таким id не найдена'));

    return res.status(STATUS_CODE.OK).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const message = composeErrorMessage(error);
      return next(new ValidationError(message));
    }

    return next(error);
  }
};

export const deleteLikeFromCard = async (
  req: ICustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { cardId } = req.params;
  const userId = req.user?._id as unknown as mongoose.Schema.Types.ObjectId;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    ).orFail(new NotFoundError('Карточка с таким id не найдена'));

    return res.status(STATUS_CODE.OK).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const message = composeErrorMessage(error);
      return next(new ValidationError(message));
    }

    return next(error);
  }
};
