const students = [
  {
    name: "Rayan",
    grade: 9.8,
  },

  {
    name: "Caio Neves",
    grade: 10,
  },

  {
    name: "Joca",
    grade: 2,
  },
];

const medium = (students[0].grade + students[1].grade + students[2].grade) / 3;

if (medium > 5) {
  console.log(`The medium of the students is: ${medium}. Congrats!!`);
} else {
  console.log(`The medium of the students is: ${medium}. Oh God!!`);
}   