function doubleCallback(number1, number2) {
  const result = number1 * 2 + number2;
  console.log(result)
  return result;
}

async function printSeveral() {
  let result = await doubleCallback(5, 0);
  result = await doubleCallback(12, result);
  result = await doubleCallback(24, result);
  result = await doubleCallback(35, result);
  result = await doubleCallback(46, result);
}

printSeveral();
