const student01 = {
  name: "Rayan",
  grade: 9.8,
};

const student02 = {
  name: "Caio Neves",
  grade: 10,
};

const student03 = {
  name: "Rayan",
  grade: 2,
};

const medium = (student01.grade + student02.grade + student03.grade) / 3;

if (medium > 5) {
  console.log(`The medium of the students is: ${medium}. Congrats!!`);
} else {
  console.log(`The medium of the students is: ${medium}. Oh God!!`);
}   
