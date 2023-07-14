import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { UpdateWriteOpResult } from 'mongoose';
import catchAsync from '../../../share/catchAsync';
import sendResponse from '../../../share/sendResponse';
import { IBook } from './book.interface';
import { BookService } from './book.service';

const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookService.createBook(req.body);
    await result.save();

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan created successfully!',
      data: result,
    });
  }
);

const getBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookService.getAllBook();

    sendResponse<IBook[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan retrieved successfully!',
      data: result,
    });
  }
);

const updateBookById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BookService.updateBook(id, req.body);
    sendResponse<UpdateWriteOpResult>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan retrieved successfully!',
      data: result,
    });
  }
);

const deleteBookById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await BookService.deleteBook(id);

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'plan delete successfully!',
      data: result,
    });
  }
);

export const bookController = {
  createBook,
  getBook,
  deleteBookById,
  updateBookById,
};
