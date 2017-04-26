# MongoDB Live Coding
April 27, 2017 at Faculty of Engineering, Chulalongkorn University

## Overview
A REST API for students enrollment. You will also learn how to use
- Postman
- Mongoose
- Express.js
- async/await

## API Endpoints
> GET /students

List all students

> POST /students

Add new student

> DELETE /students/:id

Delete specified student

> POST /courses/:id/enroll

Enroll student to specified course and give the student a grade (Can be enrolled once only)

> GET /courses/:id

Get course detail, along with enrolled students count and class average GPA