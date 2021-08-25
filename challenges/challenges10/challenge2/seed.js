const faker = require("faker");

const Student = require("./src/app/models/Student");
const Teacher = require("./src/app/models/Teacher");
const education_levels = require("./src/lib/education_levels");
const { parseDate } = require("./src/lib/utils");

let teacherIds = [],
  totalStudents = 5,
  totalTeachers = 3;

async function createTeachers() {
  const teachers = [];
  const educationOfTeacher = Object.keys(education_levels.teacher);
  while (teachers.length < totalTeachers) {
    teachers.push({
      avatar_url: faker.image.people(),
      name: faker.name.findName(),
      birth_date: parseDate(faker.date.between('1960-01-01', '2002-12-31')).iso,
      education_level: educationOfTeacher[Math.floor(Math.random() * educationOfTeacher.length)],
      class_type: ['remote', 'presential'][Math.floor(Math.random() * 2)],
      subjects_taught: faker.lorem.words().replace(' ',','),
      created_at: parseDate(Date.now()).iso
    });
  }
  const teachersPromise = teachers.map((teacher) => Teacher.create(teacher));
  teacherIds = await Promise.all(teachersPromise);
  return;
}

async function createStudents() {
  const students = [];
  const educationOfStudent = Object.keys(education_levels.student);
  while (students.length < totalStudents) {
    students.push({
      avatar_url: faker.image.people(),
      name: faker.name.findName(),
      email: faker.internet.email(),
      birth_date: parseDate(faker.date.between('2000-01-01', '2015-12-31')).iso,
      education_level: educationOfStudent[Math.floor(Math.random() * educationOfStudent.length)],
      weektime: parseInt(Math.random() * 50),
      teacher_id: teacherIds[Math.floor(Math.random() * totalTeachers)],
    });
  }
  const studentsPromise = students.map((student) => Student.create(student));
  await Promise.all(studentsPromise);
}

async function init() {
  await createTeachers();
  await createStudents()
}

init();
