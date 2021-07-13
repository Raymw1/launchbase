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
];


const medium1 = getMedium(studentsClassA);
const medium2 = getMedium(studentsClassB);

sendMessage(medium1, "Class A");
sendMessage(medium2, "Class B");


function getMedium(studentsClass) {
  return (studentsClass[0].grade + studentsClass[1].grade + studentsClass[2].grade) / 3;
}

function sendMessage(medium, classe) {
  if (medium > 5) {
    console.log(`The medium of the students of ${classe} is: ${medium}. Congrats!!`);
  } else {
    console.log(`The medium of the students of ${classe} is: ${medium}. Oh God!!`);
  }
}
