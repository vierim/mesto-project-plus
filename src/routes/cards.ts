import { Router } from 'express';

import {
  createCard,
  deleteCard,
  getCards,
  addLikeToCard,
  deleteLikeFromCard,
} from '../controllers/cards';

import {
  validateCreateCardReq,
  validateCardIdParam,
} from '../middlewares/validation';

const router = Router();

router.get('/', getCards);

router.post('/', validateCreateCardReq, createCard);
router.delete('/:cardId', validateCardIdParam, deleteCard);

router.put('/:cardId/likes', validateCardIdParam, addLikeToCard);
router.delete('/:cardId/likes', validateCardIdParam, deleteLikeFromCard);

export default router;
