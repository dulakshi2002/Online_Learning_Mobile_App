import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  resourceUrl: { 
    type: String, 
    required: true 
  }
});

const CourseSchema = new mongoose.Schema({
  title:       { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  instructor:  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content:     { 
    type: [LessonSchema], 
    default: [] 
  }   
}, { timestamps: true });

const Course = mongoose.model('Course', CourseSchema);

export default Course; 
