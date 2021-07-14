// ------------------- IMC CALCULATOR ------------------- 
const username = "Rayan";
const weight = 82;
const height = 1.75;

const imc = weight / (height * height);

if (imc >= 30) {
    console.log(`${username}, you're overweight.`)
}   else {
    console.log(`${username}, you're not overweight.`)
}