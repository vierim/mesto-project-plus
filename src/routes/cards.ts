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
  validateIdParam,
} from '../middlewares/validation';

const router = Router();

router.get('/', getCards);

router.post('/', validateCreateCardReq, createCard);
router.delete('/:cardId', validateIdParam, deleteCard);

router.put('/:cardId/likes', validateIdParam, addLikeToCard);
router.delete('/:cardId/likes', validateIdParam, deleteLikeFromCard);

export default router;
