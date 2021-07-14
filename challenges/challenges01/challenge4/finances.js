const user = {
  name: "Rayan",
  transactions: [],
  balance: 0,
};

function createTransaction(transaction) {
  if (transaction.type == "credit") {
    user.balance += transaction.value;
  } else if (transaction.type == "debit") {
    user.balance -= transaction.value;
  }
  user.transactions.push(transaction);
}

function getHigherTransactionByType(type) {
  let higher = { value: 0 };
  for (let transaction of user.transactions) {
    if (transaction.type == type && transaction.value > higher.value) {
      higher = transaction;
    }
  }
  return higher;
}

function getAverageTransactionValue() {
  let average = 0;
  for (transaction of user.transactions) {
    average += transaction.value;
  }
  average /= user.transactions.length;
  return average;
}

function getTransactionsCount() {
  let transactions = { credit: 0, debit: 0 };
  for (transaction of user.transactions) {
    if (transaction.type == "credit") {
      transactions.credit++;
    } else if (transaction.type == "debit") {
      transactions.debit++;
    }
  }
  return transactions;
}

createTransaction({ type: "credit", value: 50 });
createTransaction({ type: "credit", value: 120 });
createTransaction({ type: "debit", value: 80 });
createTransaction({ type: "debit", value: 30 });

console.log(user.balance); // 60

console.log(getHigherTransactionByType("credit")); // { type: 'credit', value: 120 }
console.log(getHigherTransactionByType("debit")); // { type: 'debit', value: 80 }

console.log(getAverageTransactionValue()); // 70

console.log(getTransactionsCount()); // { credit: 2, debit: 2 }