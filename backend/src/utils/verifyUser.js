import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // Using cookies to store token

  if (!token) {
    return next(errorHandler(401, 'You are not authenticated!'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return next(errorHandler(403, 'Invalid token!'));
    req.user = { id: payload.id, role: payload.role };
    next(); // Continue to the next middleware or route handler
  });
};

export const verifyInstructor = (req, res, next) => {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ message: 'Instructor access only' });
  }
  next();
};
