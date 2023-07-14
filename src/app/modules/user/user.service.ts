import httpStatus from 'http-status';
import { SortOrder, UpdateWriteOpResult } from 'mongoose';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { userSearchableFields } from './user.constant';
import { ICard, IPlan, IUser, IUserFilters } from './user.interface';
import { User } from './user.model';

const getAllUser = async (
  filters: IUserFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: userSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $paginationOptions: 'i',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await User.find(whereConditions)
    .populate('plan')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await User.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const singleUpdateById = async (
  Id: string,
  data: Partial<IUser> | ICard
): Promise<IUser | ICard | UpdateWriteOpResult> => {
  const me: IUser | null = await User.findOne({ _id: Id });
  if (!me) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not find');
  }

  const result = await User.updateOne(
    { _id: Id },
    { $set: data },
    { new: true, upsert: true }
  );

  return result;
};

const cardSetAndUpdate = async (Id: string, data: ICard): Promise<IUser> => {
  const me: IUser | null = await User.findOne({ _id: Id });

  if (!me) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (data.cardName) {
    const existCard = me.card?.find((i: ICard) => i.cardName === data.cardName);

    if (existCard) {
      await User.updateOne(
        { _id: Id, 'card._id': existCard._id },
        {
          $set: {
            'card.$.cardName': data.cardName,
            'card.$.cardNum': data.cardNum,
          },
        },
        { new: true, upsert: true }
      );
    } else {
      await User.findByIdAndUpdate(
        Id,
        {
          $push: {
            card: data,
          },
        },
        { new: true, upsert: true }
      );
    }

    // Fetch the updated user data
    const updatedUser: IUser | null = await User.findOne({ _id: Id });
    if (!updatedUser) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to updated card'
      );
    }
    return updatedUser;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide valid data');
  }
};

const planActiveAndUpdate = async (Id: string, data: IPlan): Promise<IUser> => {
  const me: IUser | null = await User.findOne({ _id: Id });

  if (!me) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const price = me?.balance - data?.price;

  if (data.planId) {
    await User.findByIdAndUpdate(
      Id,
      {
        $push: {
          plan: data,
        },
        $set: {
          balance: price,
        },
      },
      { new: true, upsert: true }
    );

    // Fetch the updated user data
    const updatedUser: IUser | null = await User.findOne({ _id: Id });
    if (!updatedUser) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to updated card'
      );
    }
    return updatedUser;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide valid data');
  }
};

const deleteUserById = async (id: string): Promise<any> => {
  const user: IUser | null = await User.findOne({ _id: id });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not find');
  }
  const result = await User.deleteOne({ _id: id });
  return result;
};

export const UserService = {
  getAllUser,
  singleUpdateById,
  deleteUserById,
  cardSetAndUpdate,
  planActiveAndUpdate,
};
