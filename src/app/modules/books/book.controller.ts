import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { UpdateWriteOpResult } from 'mongoose';
import catchAsync from '../../../share/catchAsync';
import sendResponse from '../../../share/sendResponse';
import { IBook } from './book.interface';

const createPlan: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PlanService.createPlan(req.body);
    await result.save();

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan created successfully!',
      data: result,
    });
  }
);

const getPlan: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await PlanService.getAllPlan();

    sendResponse<IBook[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan retrieved successfully!',
      data: result,
    });
  }
);

const updatePlanById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PlanService.updatePlan(id, req.body);
    sendResponse<UpdateWriteOpResult>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Plan retrieved successfully!',
      data: result,
    });
  }
);

const deletePlanById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await PlanService.deletePlan(id);

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'plan delete successfully!',
      data: result,
    });
  }
);

export const planController = {
  createPlan,
  getPlan,
  deletePlanById,
  updatePlanById,
};
