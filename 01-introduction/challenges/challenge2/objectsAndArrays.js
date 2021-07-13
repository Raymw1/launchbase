const programmer = {
  name: "Rayan",
  age: 17,
  techs: [
    {
      name: "HTML",
      speciality: "Web"
    },
    {
      name: "CSS",
      speciality: "Web Design"
    },
    {
      name: "JavaScript",
      speciality: "Web/Mobile"
    },
    {
      name: "NodeJS",
      speciality: "Server"
    },
    {
      name: "Python",
      speciality: "Desktop"
    }
  ]
};

console.log(`The user ${programmer.name} is ${programmer.age} years old and uses the tech ${programmer.techs[0].name} with speciality in ${programmer.techs[0].speciality}`);