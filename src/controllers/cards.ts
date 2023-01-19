import { Request, Response } from 'express';

import mongoose from 'mongoose';
import { ICustomRequest } from '../types';
import Card from '../models/card';

import STATUS_CODE from '../utils/constants';

export const getCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({}).populate('owner', ['name', 'about']);

    return res.status(STATUS_CODE.OK).send(cards);
  } catch {
    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const createCard = async (req: ICustomRequest, res: Response) => {
  const { name, link } = req.body;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new Error('User _id is undefined');
    }

    const card = await Card.create({ name, link, owner: userId });

    return res.status(STATUS_CODE.OK).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: 'Переданы некорректные данные при обновлении профиля',
      });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const deleteCard = async (req: ICustomRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId) {
      const error = new Error('Необходима авторизация');
      error.name = 'AuthError';

      throw error;
    }

    const card = await Card.findById(cardId).populate({ path: 'owner', match: { _id: userId } });

    if (!card) {
      const error = new Error('Карточка с таким id не найдена');
      error.name = 'CardNotFound';

      throw error;
    }

    if (!card.owner) {
      const error = new Error('Карточка с таким id принадлежит другому пользователю');
      error.name = 'CardHasOtherOwner';

      throw error;
    }

    await Card.findByIdAndDelete(cardId);

    return res.status(STATUS_CODE.OK).send({ message: 'Карточка удалена' });
  } catch (error) {
    if (error instanceof Error && error.name === 'AuthError') {
      return res
        .status(STATUS_CODE.AUTH_ERROR)
        .send({ message: 'Необходима авторизация' });
    }

    if (error instanceof Error && error.name === 'CardNotFound') {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: 'Карточка по указанному _id не найдена' });
    }

    if (error instanceof Error && error.name === 'CardHasOtherOwner') {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: 'Карточка с таким id принадлежит другому пользователю' });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }

  // try {
  //   const card = await Card.findByIdAndDelete(cardId);

  //   if (!card) {
  //     const error = new Error('Карточка с таким id не найдена');
  //     error.name = 'CardNotFound';

  //     throw error;
  //   }

  //   return res.status(STATUS_CODE.OK).send({ message: 'Карточка удалена' });
  // } catch (error) {
  //   if (error instanceof Error && error.name === 'CardNotFound') {
  //     return res
  //       .status(STATUS_CODE.NOT_FOUND)
  //       .send({ message: 'Карточка по указанному _id не найдена' });
  //   }

  //   return res
  //     .status(STATUS_CODE.DEFAULT_ERROR)
  //     .send({ message: 'На сервере произошла ошибка' });
  // }
};

export const addLikeToCard = async (req: ICustomRequest, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId) {
      throw new Error('User _id is undefined');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      const error = new Error('Карточка с таким id не найдена');
      error.name = 'CardNotFound';

      throw error;
    }

    return res.status(STATUS_CODE.OK).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: 'Переданы некорректные данные для добавления лайка с карточки',
      });
    }

    if (error instanceof Error && error.name === 'CardNotFound') {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: 'Карточка по указанному _id не найдена' });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};

export const deleteLikeFromCard = async (
  req: ICustomRequest,
  res: Response,
) => {
  const { cardId } = req.params;
  const userId = req.user?._id as unknown as mongoose.Schema.Types.ObjectId;

  try {
    if (!userId) {
      throw new Error('User _id is undefined');
    }

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      const error = new Error('Карточка с таким id не найдена');
      error.name = 'CardNotFound';

      throw error;
    }

    return res.status(STATUS_CODE.OK).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(STATUS_CODE.BAD_REQUEST).send({
        message: 'Переданы некорректные данные для снятия лайка с карточки',
      });
    }

    if (error instanceof Error && error.name === 'CardNotFound') {
      return res
        .status(STATUS_CODE.NOT_FOUND)
        .send({ message: 'Карточка по указанному _id не найдена' });
    }

    return res
      .status(STATUS_CODE.DEFAULT_ERROR)
      .send({ message: 'На сервере произошла ошибка' });
  }
};
