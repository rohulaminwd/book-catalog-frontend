import { UpdateWriteOpResult } from 'mongoose';
import { IBook } from './book.interface';
import Book from './book.model';

const createBook = async (TaskInfo: IBook): Promise<IBook> => {
  const request = await Book.create(TaskInfo);
  return request;
};

const getAllBook = async (): Promise<IBook[]> => {
  const request = await Book.find({});
  return request;
};

const updateBook = async (
  Id: string,
  data: IBook
): Promise<UpdateWriteOpResult> => {
  const result = await Book.updateOne(
    { _id: Id },
    { $set: data },
    { new: true, upsert: true }
  );

  return result;
};

const deleteBook = async (id: string): Promise<any> => {
  const result = await Book.deleteOne({ _id: id });
  return result;
};

export const BookService = {
  createBook,
  getAllBook,
  updateBook,
  deleteBook,
};
