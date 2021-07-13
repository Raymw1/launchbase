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

function checkIfUsesCSS(user) {
  // if (user.techs.find(tech => tech == "CSS")) {
  if (user.techs.includes("CSS")) return true;
  return false;
}

for (let user of users) {
  const userUsesCSS = checkIfUsesCSS(user);
  if (userUsesCSS) {
    console.log(`The user ${user.name} works with CSS`);
  }
}
