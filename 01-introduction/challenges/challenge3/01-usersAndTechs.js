const users = [
  {
    name: "Rayan",
    techs: ["HTML", "CSS", "JavaScript", "Python"],
  },
  {
    name: "Mayk",
    techs: ["JavaScript", "CSS", "C"],
  },
  {
    name: "Jakelliny",
    techs: ["HTML", "Node.js", "Ruby"],
  },
];

for (let user of users) {
  console.log(`${user.name} works with ${user.techs.join(', ')}.`);
}
