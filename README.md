# MongoDB Live Coding
April 27, 2017 at Faculty of Engineering, Chulalongkorn University

## Overview
A REST API for students enrollment

## API Endpoints
> GET /students

List all students

> POST /students

Add new student

> GET /students/:id

Get specified student detail, along with GPA

> DELETE /students/:id

Delete specified student

> POST /courses/:id/enroll/:studentId

Enroll student to specified course (Can be enrolled once only)

> POST /courses/:id/graded/:studentId

Give the student a grade (The student must be enrolled and has not been graded before)

> POST /courses/:id

Get course detail, along with enrolled students count and class average GPA