const user = {
  name: "Rayan",
  company: {
    name: "RocketSeat",
    color: "Purple",
    category: "Programming",
    address: {
      street: "Rua Guilherme Gembala",
      number: 260,
    },
  },
};

console.log(
  `The company ${user.company.name} is located at ${user.company.address.street}, ${user.company.address.number}`
);
