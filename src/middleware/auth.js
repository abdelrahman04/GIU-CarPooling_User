import { jwtService } from '../services/jwt.service.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      console.log('No auth header found');
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('No token found in auth header');
      req.user = null;
      return next();
    }

    try {
      console.log('Attempting to verify token...');
      const user = await jwtService.verifyAccessToken(token);
      console.log('Token verified, user:', user ? 'Found' : 'Not found');
      if (user) {
        console.log('User ID:', user.id);
        console.log('User email:', user.email);
      }
      req.user = user;
    } catch (error) {
      console.log('Token verification failed:', error.message);
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.log('Auth middleware error:', error.message);
    req.user = null;
    next();
  }
}; 