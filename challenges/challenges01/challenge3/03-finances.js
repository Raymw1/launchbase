const users = [
  {
    name: "Salvio",
    incomes: [115.3, 48.7, 98.3, 14.5],
    expenses: [85.3, 13.5, 19.9],
  },
  {
    name: "Marcio",
    incomes: [24.6, 214.3, 45.3],
    expenses: [185.3, 12.1, 120.0],
  },
  {
    name: "Lucia",
    incomes: [9.8, 120.3, 340.2, 45.3],
    expenses: [450.2, 29.9],
  },
];

for (let user of users) {
  let balance = calculateBalance(user.incomes, user.expenses);
  if (balance < 0) {
    console.log(`${user.name} has NEGATIVE balance of ${balance.toFixed(2)}`);
  } else {
    console.log(`${user.name} has POSITIVE balance of ${balance.toFixed(2)}`);
  }
}

function calculateBalance(incomes, expenses) {
  let balance = sumNumbers(incomes) - sumNumbers(expenses);
  return balance;
}

function sumNumbers(numbers) {
  let total = 0;
  numbers.forEach(number => total += number);
  return total;
}
