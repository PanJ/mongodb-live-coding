const { Student, Course } = require('./models');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

app.post('/students', async (req, res) => {
  console.log(req.body);
  const student = new Student(req.body);
  await student.save();
  console.log(student);
  res.send(student);
});

app.delete('/students/:id', async (req, res) => {
  const student = await Student.findOne({ student_id: req.params.id });
  if (!student) {
    res.status(404).send({ message: "Not Found" });
    return;
  }
  await student.remove();
  res.send({ message: 'Success' });
});

app.post('/courses/:id/enroll', async (req, res) => {
  const [course, student] = await Promise.all([
    Course.findOne({ course_id: req.params.id }),
    Student.findOne({ student_id: req.body.student_id })
  ]);
  if (!course) {
    res.status(404).send({ message: "Course not Found" });
    return;
  }
  if (!student) {
    res.status(404).send({ message: "Student not Found" });
    return;
  }
  const isEnrolled = student.enrolled_courses.filter((c) => c.course_id == course.course_id).length > 0;
  if (isEnrolled) {
    res.status(500).send({ message: "Student already enrolled" });
    return;
  }
  student.enrolled_courses.push({
    course_id: course.course_id,
    grade: req.body.grade,
  });
  await student.save();
  res.send({ message: 'Success' });
});

app.get('/courses/:id', async (req, res) => {
  const course = await Course.findOne({ course_id: req.params.id }).lean();
  const data = await Student.aggregate(
    { $match: {'enrolled_courses.course_id': req.params.id } },
    { $unwind: '$enrolled_courses' },
    { $match: {'enrolled_courses.course_id': req.params.id } },
    { $group: { _id: null, avgGpa: { $avg: '$enrolled_courses.grade'}, count: { $sum: 1 } } }
  );
  if (!course) {
    res.status(404).send({ message: "Course not Found" });
    return;
  }
  course.count = 0;
  if (data.length > 0) {
    course.count = data[0].count;
    course.avgGpa = data[0].avgGpa;
  }
  res.send(course);
});

app.listen(3000, () => console.log('Listening on port 3000'));
