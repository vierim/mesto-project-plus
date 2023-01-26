import { Router } from 'express';

import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from '../controllers/users';

import {
  validateUserIdParam,
  validateUpdateProfileReq,
  validateUpdateAvatarReq,
} from '../middlewares/validation';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserIdParam, getUserById);

router.patch('/me', validateUpdateProfileReq, updateProfile);
router.patch('/me/avatar', validateUpdateAvatarReq, updateAvatar);

export default router;
