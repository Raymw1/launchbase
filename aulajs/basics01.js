const aluno01 = "Rayan";
const notaAluno01 = 9.8;
const aluno02 = `Caio Neves`;
const notaAluno02 = 10;
const aluno03 = 'Laurence';
const notaAluno03 = 2;

const media = (notaAluno01 + notaAluno02 + notaAluno03) / 3;

console.log(`O tipo da var aluno02 é: ${typeof aluno02}`);
console.log(`O tipo da var notaAluno01 é: ${typeof notaAluno01}`);

if (media > 5) {
    console.log(`A média da nota dos alunos é: ${media}. Estão de parabéns!!`);
}   else {
    console.log(`A média da nota dos alunos é: ${media}. É uma pena!!`);
}