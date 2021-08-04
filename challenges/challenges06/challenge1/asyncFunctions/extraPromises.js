function doublePromise(number1, number2) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const realresult = number1 * 2 + number2;
      console.log(realresult);
      resolve({ number1, number2, realresult });
      // Isto é apenas um exemplo para criar assincronismo
      // Cumprimos a promessa !
    }, Math.floor(Math.random() * 100) + 1);
  });
}
doublePromise(5, 0)
  .then((result) => {
    return doublePromise(12, result.realresult);
  })
  .then((result) => {
    return doublePromise(24, result.realresult);
  })
  .then((result) => {
    return doublePromise(35, result.realresult);
  })
  .then((result) => {
    return doublePromise(46, result.realresult);
  })
  