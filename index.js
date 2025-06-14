import PromptSync from "prompt-sync";

const prompt = PromptSync();

/*let x = prompt("enter x ");
let intx = parseInt(x);
let y = prompt("enter y ");
let inty = parseInt(y);
console.log(intx+inty);*/



const expenseTracker = () =>
{
    //this function is for basic expense tracking
    let expense = {};
    let date;
    let amount;
    let category;
    let note;
}

const analysis = () =>
{
    //no idea what i am going to do , prob some module
}


console.log(" -- Welcome To My Expense Tracker Application -- ");

let start = true;
while(start)
{
    // this while loop ensure sthe program doesnt stop if user accidentialy types anythig except a,b,e
    let choice;
    console.log(" Press A for adding a new expense ");
    console.log(" Press B for Analysis (charts that show your expenditure pattern) ");
    console.log(" Press e to stop the program !! ");

    choice = prompt(" Make A Choice !! ");

    const ch = choice.toLowerCase();

    switch(ch)
    {
        case "a":
            console.log("you made choice a");
            break;    
        case "b":
            console.log("you made choice b ");
            break;
        case "e":
            console.log(" Spend More , Live Happilly ");
            start = false;   
        default:
            console.log("invalid choice !! ");
                        
    }

}