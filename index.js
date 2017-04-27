const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Student, Course } = require('./models');

app.use(bodyParser.json());

app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

app.post('/students', async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.send(student);
});

app.delete('/students/:id', async (req, res) => {
  const student = await Student.findOne({
    id: req.params.id
  });
  await student.remove();
  res.send({
    message: 'Success'
  });
});

app.post('/courses/:id/enroll', async (req, res) => {
  const [course, student] = await Promise.all([
    Course.findOne({ id: req.params.id }),
    Student.findOne({ id: req.body.student_id })
  ]);
  if (!course) {
    res.status(404).send({ message: 'Course not found' });
    return;
  }
  if (!student) {
    res.status(404).send({ message: 'Student not found' });
    return;
  }
  const isEnrolled = student.enrolled_courses.filter((c) => c.course_id === course.id).length > 0;
  if (isEnrolled) {
    res.status(500).send({ message: 'Student already enrolled' });
    return;
  }
  student.enrolled_courses.push({
    course_id: course.id,
    grade: req.body.grade
  });
  await student.save();
  res.send({ message: 'Success' });
});

app.get('/courses/:id', async (req, res) => {
  const getCourse = Course.findOne({ id: req.params.id }).lean();
  const getData = Student.aggregate([
    { $match: { 'enrolled_courses.course_id': req.params.id } },
    { $unwind: '$enrolled_courses' },
    { $match: { 'enrolled_courses.course_id': req.params.id } },
    { $group: {
      _id: null,
      avgGpa: { $avg: '$enrolled_courses.grade'},
      count: { $sum: 1 }
    }}
  ]);
  const [course, data] = await Promise.all([getCourse, getData]);
  if (data.length > 0) {
    course.avgGpa = data[0].avgGpa;
    course.count = data[0].count;
  }
  res.send(course);
});

app.listen(3000, () => {
  console.log('Student API listening on port 3000!');
});