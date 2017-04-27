var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/enrollment');

const Student = mongoose.model('Student', {
  id: String,
  name: String,
  enrolled_courses: [{
    course_id: String,
    grade: Number
  }],
});

const Course = mongoose.model('Course', {
  id: String,
  name: String,
  summary: String,
})

module.exports = {
  Student,
  Course
}