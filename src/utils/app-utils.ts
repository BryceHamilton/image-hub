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

export const cors: RequestHandler = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({
      Message: 'Working',
    });
  }
  next();
};
