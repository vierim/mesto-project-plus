import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);

router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
