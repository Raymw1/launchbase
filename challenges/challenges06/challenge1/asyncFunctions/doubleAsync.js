function doubleCallback(number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(console.log(number * 2));
    }, Math.floor(Math.random() * 100) + 1);
  })
}

async function printSeveral() {
  await doubleCallback(2);
  await doubleCallback(5);
  await doubleCallback(98);
  await doubleCallback(35);
  await doubleCallback(46);
}

printSeveral();
