function doublePromise(number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        number,
        double: () => {
          console.log(number * 2);
        },
      });
      // Isto é apenas um exemplo para criar assincronismo
      // Cumprimos a promessa !
    }, Math.floor(Math.random() * 100) + 1);
  });
}
doublePromise(3).then((result) => {
  result.double()
  return doublePromise(5);
}).then((result) => {
  result.double()
  return doublePromise(34);
}).then((result) => {
  result.double()
  return doublePromise(53);
}).then((result) => {
  result.double()
  return doublePromise(46);
}).then((result) => {
  result.double()
});

// function doubleCallback(number) {
//   setTimeout(() => {
//     console.log(number * 2);
//   }, Math.floor(Math.random() * 100) + 1);
// }

// function printSeveral() {
//   doubleCallback(2).then(
//     doubleCallback(5).then(
//       doubleCallback(98).then(doubleCallback(35).then(doubleCallback(46)))
//     )
//   );
// }

// printSeveral();
