import { jwtService } from '../services/jwt.service.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const user = await jwtService.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    next();
  }
}; 