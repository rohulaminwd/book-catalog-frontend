import express from 'express';
import { bookController } from './book.controller';
const router = express.Router();

router.post('/create', bookController.createBook);
router.get('/', bookController.getBook);

router
  .route('/:id')
  .patch(bookController.updateBookById)
  .delete(bookController.deleteBookById);

export const BookRoutes = router;
