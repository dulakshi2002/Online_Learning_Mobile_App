import express from 'express';
import { verifyToken, verifyInstructor } from '../utils/verifyUser.js';
import { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse } from '../controllers/course.controller.js';

const router = express.Router();

// Public: list & view
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected: only instructors
router.post('/create', verifyToken, verifyInstructor, createCourse);
router.put('/:id', verifyToken, verifyInstructor, updateCourse);
router.delete('/:id', verifyToken, verifyInstructor, deleteCourse);

export default router;
