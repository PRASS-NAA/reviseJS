import PromptSync from "prompt-sync";

const prompt = PromptSync();

let x = prompt("enter x ");
let intx = parseInt(x);
let y = prompt("enter y ");
let inty = parseInt(y);
console.log(intx+inty);