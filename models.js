const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/enrollment');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Student = mongoose.model('Student', {
  name: String,
  student_id: String,
  enrolled_courses: [{
    course_id: String,
    grade: Number,
  }]
})

const Course = mongoose.model('Course', {
  name: String,
  course_id: String,
  summary: String,
});

module.exports = {
  Student, Course
};
