function doubleCallback(number1, number2, callback) {
  setTimeout(() => {
    const result = number1 * 2 + number2
    console.log(result);
    if (callback) callback(result);
  }, Math.floor(Math.random() * 100) + 1);
}

function printSeveral() {
  doubleCallback(5, 0, (result) => {
    doubleCallback(12, result, (result) => {
      doubleCallback(24, result, (result) => {
        doubleCallback(35,result, (result) => {
          doubleCallback(46, result);
        });
      });
    });
  });
}

printSeveral();
