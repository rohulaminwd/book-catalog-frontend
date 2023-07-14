import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.get('/', UserController.getAllUser);
router.patch('/setcard/:id', UserController.cardSetAndUpdate);
router.patch('/plan/:id', UserController.planActiveAndUpdate);
router.patch(
  '/:id',
  validateRequest(UserValidation.updateUserZodSchema),
  UserController.singleUpdate
);

router.delete('/:id', UserController.deleteUserById);

export const UserRoutes = router;
