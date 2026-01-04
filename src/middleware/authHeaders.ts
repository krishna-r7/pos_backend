import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
  userId: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}


export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const publicPaths = [

   '/api/user/create',
   '/api/user/login'

  ];

  const dynamicPublicPaths = [
    '/api/product/getproductbycategory/',
  ];


  // Allow public routes
  if (publicPaths.includes(req.path) ||
    dynamicPublicPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (authHeader) {

    // console.log(authHeader);
    const token = authHeader.split(' ')[1];

    // console.log(token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.user = decoded; // Store decoded token in req.user
      // console.log(req.user,'user')
      next();
    } catch (error) {
      return res.status(707).json({ message: 'Invalid or expired token', status_code: 707, data: null });
    }
  } else {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
};




