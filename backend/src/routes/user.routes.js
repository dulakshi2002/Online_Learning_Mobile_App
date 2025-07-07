import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  getAllUsers,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Public health-check
router.get('/', test);

// Protected: update and delete (self or instructor)
router.put('/update/:id',    verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

// Protected: list all users (instructors only)
router.get('/all', verifyToken, getAllUsers);

export default router;
