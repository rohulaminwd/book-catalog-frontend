/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type UserName = {
  firstName: string;
  lastName: string;
  middleName: string;
};

export type ICard = {
  cardNum: string;
  cardName: string;
  _id: string;
};

export type IPlan = {
  status: 'active' | 'inactive';
  planId: Types.ObjectId | IPlan;
  date: string;
  planDuration: string;
  price: number;
};

export type IUser = {
  save(): unknown;
  name: UserName;
  role: 'user' | 'admin' | 'subAdmin';
  status: 'active' | 'inactive' | 'block';
  password: string;
  balance: number;
  gender?: 'male' | 'female';
  email?: string;
  phoneNumber: string;
  ipAddress: string;
  address?: string;
  imageURL?: string;
  referCode?: string;
  myReferralCode: string;
  card?: ICard[];
  plan?: IPlan[];
};

export type UserModel = {
  isUserExist(
    id: string
  ): Promise<Pick<IUser, 'password' | 'role' | 'phoneNumber' | 'status'>>;
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserFilters = {
  searchTerm?: string;
  email?: string;
  phoneNumber?: string;
};
