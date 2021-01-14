import { ErrorRequestHandler, RequestHandler } from 'express';

export const catchAllErrors: ErrorRequestHandler = (
  error,
  req,
  res,
  next,
): void => {
  console.error(error.stack);
  res.status(error.status || 500).send({
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
): Promise<void> =>
  Promise.resolve(fn(req, res, next)).catch((err) => {
    res.status(500).json({ msg: 'Server Error', error: err });
  });

export const asyncHandlerRedirect = (fn: RequestHandler): RequestHandler => (
  req,
  res,
  next,
): Promise<void> =>
  Promise.resolve(fn(req, res, next)).catch(() => res.redirect('/'));
