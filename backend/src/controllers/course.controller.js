// controllers/course.controller.js
import Course from '../models/course.model.js';
import { errorHandler } from '../utils/error.js';

/*
 Create a new course.
 Only instructors (via verifyInstructor) should reach this.
*/
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, content } = req.body;
    if (!title || !description) {
      return next(errorHandler(400, 'Title and description are required'));
    }

    const newCourse = new Course({
      title,
      description,
      instructor: req.user.id,
      content: content || []
    });

    const saved = await newCourse.save();
    res.status(201).json({
      message: 'Course created successfully',
      course: saved
    });
  } catch (err) {
    next(err);
  }
};


//Get all courses (public)

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course
      .find()
      .populate('instructor', 'username email');
    res.status(200).json(courses);
  } catch (err) {
    next(err);
  }
};


//Get a single course by ID (public).

export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course
      .findById(req.params.id)
      .populate('instructor', 'username email');

    if (!course) {
      return next(errorHandler(404, 'Course not found'));
    }

    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};


/*
Update a course.
Only the instructor who created it may update.
*/
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(errorHandler(404, 'Course not found'));
    }

    // Authorization: only the owner can update
    if (course.instructor.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to update this course'));
    }

    const { title, description, content } = req.body;
    if (title !== undefined)       course.title = title;
    if (description !== undefined) course.description = description;
    if (content !== undefined)     course.content = content;

    const updated = await course.save();
    res.status(200).json({
      message: 'Course updated successfully',
      course: updated
    });
  } catch (err) {
    next(err);
  }
};


/*
Delete a course.
Only the instructor who created it may delete.
*/
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return next(errorHandler(404, 'Course not found'));
    }

    // Authorization: only the owner can delete
    if (course.instructor.toString() !== req.user.id) {
      return next(errorHandler(403, 'You are not allowed to delete this course'));
    }

    await course.deleteOne();
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};
