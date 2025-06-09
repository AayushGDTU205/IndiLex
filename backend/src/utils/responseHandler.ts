import { Request, Response, NextFunction, RequestHandler } from 'express';
//to send the server to frontend 
export const responseHandler = (
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error: any) {
      res.status(error?.statusCode || 500).json({
        success: false,
        message: error?.message || 'Internal Server Error',
      });
    }
  };
};
