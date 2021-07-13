const username = "Ana";
const genre = 'F';
const age = 55;
const contribution = 30;

if (genre == 'M') {
    if (contribution >= 35 && (age + contribution) >= 95) {
        console.log(`${username}, you can retire!`)
    }   else {
        console.log(`${username}, you can't retire!`)
    }
}   else if (contribution >= 30 && (age + contribution) >= 85) {
    console.log(`${username}, you can retire!`)
}   else {
    console.log(`${username}, you can't retire!`)
}