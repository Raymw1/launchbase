const studentsClassA = [
  {
    name: "Rayan",
    grade: 1.8,
  },
  {
    name: "Caio Neves",
    grade: 10,
  },
  {
    name: "João",
    grade: 2,
  },
  {
    name: "Pedro",
    grade: 10,
  },
];

const studentsClassB = [
  {
    name: "Saulo",
    grade: 10,
  },
  {
    name: "Ígor",
    grade: 10,
  },
  {
    name: "Luíz",
    grade: 0,
  },
  {
    name: "Vitor",
    grade: 5,
  },
];

function markFlunked(student) {
  student.flunked = false;
  if (student.grade < 5) {
    student.flunked = true;
  }
}
//    console.table(students);

function sendMessage(student) {
  if (student.flunked) {
    console.log(`The student ${student.name} is flunked!`);
  }
}

function flunkedStudents(students) {
  for (let student of students) {
    markFlunked(student);
    sendMessage(student);
  }
}

flunkedStudents(studentsClassA);
flunkedStudents(studentsClassB);
