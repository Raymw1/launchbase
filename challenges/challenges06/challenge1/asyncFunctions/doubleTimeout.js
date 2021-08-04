function doubleCallback(number, callback) {
  setTimeout(() => {
    console.log(number * 2);
    if (callback) callback();
  }, Math.floor(Math.random() * 100) + 1);
}

function printSeveral() {
  doubleCallback(2, () => {
    doubleCallback(5, () => {
      doubleCallback(98, () => {
        doubleCallback(35, () => {
          doubleCallback(46);
        });
      });
    });
  });
}

printSeveral();
