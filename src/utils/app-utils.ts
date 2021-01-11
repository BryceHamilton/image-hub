import { ErrorRequestHandler, RequestHandler, Response } from 'express';

export const catchAllErrors: ErrorRequestHandler = (
  error,
  req,
  res: Response,
): void => {
  res.send({
    error: {
      status: error.status || 500,
      Message: error.message || 'Internal Server Error',
    },
  });
};

export const asyncHandler = (fn: RequestHandler): RequestHandler => (
  req,
  res,
  next,
): Promise<void> => Promise.resolve(fn(req, res, next)).catch(next);
