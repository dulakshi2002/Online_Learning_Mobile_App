// controllers/user.controller.js
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

/*
Health-check endpoint
 */
export const test = (req, res) => {
  res.json({ message: 'API is working!' });
};

/*
 Update a user:
 Students → can update only themselves
 Instructors → can update any user (and set roles)
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Permission check
    if (req.user.id !== id && req.user.role !== 'instructor') {
      return next(errorHandler(403, 'You can only update your own account or must be an instructor'));
    }

    // If password being changed, hash it
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Prevent role escalation by students
    if (req.body.role && req.user.role !== 'instructor') {
      delete req.body.role;
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) return next(errorHandler(404, 'User not found'));

    const { password, ...safe } = updated._doc;
    res.status(200).json(safe);
  } catch (err) {
    next(err);
  }
};

/**
 Delete a user:
 Students → can delete only themselves
 Instructors → can delete any user
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user.id !== id && req.user.role !== 'instructor') {
      return next(errorHandler(403, 'You can only delete your own account or must be an instructor'));
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return next(errorHandler(404, 'User not found'));

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

/*
 List all users:
 Only instructors may call this
 */
export const getAllUsers = async (req, res, next) => {
  try {
    if (req.user.role !== 'instructor') {
      return next(errorHandler(403, 'Instructor access only'));
    }

    const users = await User.find()
      .select('username email profilePicture role');  // omit password
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
