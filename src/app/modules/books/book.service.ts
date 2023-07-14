import { UpdateWriteOpResult } from 'mongoose';
import { IBook } from './book.interface';

const createBook = async (TaskInfo: IBook): Promise<IBook> => {
  const request = await Book.create(TaskInfo);
  return request;
};

const getAllBook = async (): Promise<IBook[]> => {
  const request = await Plan.find({});
  return request;
};

const updateBook = async (
  Id: string,
  data: IBook
): Promise<UpdateWriteOpResult> => {
  const result = await Plan.updateOne(
    { _id: Id },
    { $set: data },
    { new: true, upsert: true }
  );

  return result;
};

const deleteBook = async (id: string): Promise<any> => {
  const result = await Plan.deleteOne({ _id: id });
  return result;
};

export const BookService = {
  createBook,
  getAllBook,
  updateBook,
  deleteBook,
};
