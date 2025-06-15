import PromptSync from "prompt-sync";
import fs from "fs";

const prompt = PromptSync();

/*let x = prompt("enter x ");
let intx = parseInt(x);
let y = prompt("enter y ");
let inty = parseInt(y);
console.log(intx+inty);*/


const inputEmptyChecker = (input) =>
{
    const strinput = String(input);
    if(!strinput || strinput.trim().length == 0)
    {
        console.log(" dont give empty input please !! restart program ");
        process.exit();
    }
}


const writeExpense = (expense) =>
{
    let expenses = [];
    //read existing expenses to append this new one
    try{
        if(fs.existsSync("expenses.json"))
        {
            const data = fs.readFileSync("expenses.json", "utf-8");
            expenses = JSON.parse(data);
        }

            expenses.push(expense);

        fs.writeFileSync("expenses.json",JSON.stringify(expenses, null, 2));
        }catch(err)
        {
            console.log(err);
        }
}

const expenseTracker = () =>
{
    //this function is for basic expense tracking
    let expense = {};
    let date;
    let amount;
    let category;
    let note;
    
    let dateInput = prompt("Enter date (YYYY-MM-DD): ");
    //checkFormat();
    inputEmptyChecker(dateInput);
    date = new Date(dateInput);
    amount = parseInt(prompt("Enter the amount " ));
    inputEmptyChecker(amount);
    category = prompt("Enter the category of expenditure (food, clothes , household, fuel , taxis, others ) : ");
    inputEmptyChecker(category);
    //checkcategory();
    note = prompt(" Add note for this expenditure : ");
    inputEmptyChecker(note);

    expense["date"] = date;
    expense["amount"] = amount;
    expense["category"] = category;
    expense["note"] = note;

    console.log(expense);

    writeExpense(expense);
}

const readJson = () =>
{
    let expenses = [];
    try
    {
        if(fs.existsSync("expenses.json"))
        {
            const data = fs.readFileSync("expenses.json", "utf-8");
            expenses = JSON.parse(data);
            //console.log(expenses);
            return expenses;
        }else{
            return [];
        }
    }catch(err)
    {
        console.log(err);
        return [];
    }
}

const readExpenses = (flag) =>
{
    const expenses = readJson();
    if(!flag)
    {
        //no filtering only show all expenses
        console.log(expenses);
    }else
    {
        //search based on category (food, clothes , household, fuel , taxis, others )
        let category = prompt("Enter the Category (food, clothes , household, fuel , taxis, others)");
        let filteredcategory = [];
        for(let expense of expenses)
        {
            if(expense.category == category)
            {
                filteredcategory.push(expense);
            }
        }

        console.log(filteredcategory);
    }
}

const calSpecificExpense = (duration) =>
{
    let expenses = readJson();

    let filteredcategory = [];

    let today = new Date();
    if(duration == "week")
    {
        //expense made in last week
        let sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        for(let expense of expenses)
        {
            let expenseDate = new Date(expense.date);
            if(expenseDate >= sevenDaysAgo && expenseDate <= today)
            {
                filteredcategory.push(expense);
            }
        }

        console.log(`Expenses Made This Week (from ${sevenDaysAgo} to ${today} `);
        if(filteredcategory.length == 0 )
        {
            console.log("No expenses made this week !! ");
        }else{
            console.log(filteredcategory);
        } 
    }else{
        //expense made in last month

        let oneMonthAgo = new Date();
        oneMonthAgo.setDate(today.getDate() - 30);
        for(let expense of expenses)
        {
            let expenseDate = new Date(expense.date);
            if(expenseDate >= oneMonthAgo && expenseDate <= today)
            {
                filteredcategory.push(expense);
            }
        }

        console.log(`Expenses made this month (from ${oneMonthAgo} to ${today} `);

        if(filteredcategory.length == 0 )
        {
            console.log("No expenses made this Month !! ");
        }else{
            console.log(filteredcategory);
        } 
    }
}


const showExpenses = () =>
{
    let choice = prompt("Press 1 for listing all expenditures made , Press 2 for listing expenditure by specific category, Press 3 to list expenses made in last week, Press 4 to list expenses made in last month : ");

    inputEmptyChecker(choice);

    let strchoice = choice.trim();

    switch(strchoice)
    {
        case "1":
            readExpenses(false);
            break;
        case "2":
            readExpenses(true);
            break;
        case "3":
            calSpecificExpense("week");
            break;
        case "4":
            calSpecificExpense("month");
            break;        
        default:
            console.log("Wrong Choice Made !! program has terminated !! ");
            process.exit();        
    }
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
    console.log(" Press B for seeing all expenses ");
    console.log(" Press e to stop the program !! ");

    choice = prompt(" Make A Choice !! ");
    inputEmptyChecker(choice);

    const ch = choice.toLowerCase();

    switch(ch)
    {
        case "a":
            console.log("you made choice a");
            expenseTracker();
            break;    
        case "b":
            console.log("you made choice b");
            showExpenses();
            break;    
        case "e":
            console.log(" Spend More , Live Happilly ");
            start = false;   
            break;
        default:
            console.log("invalid choice !! ");
                        
    }

}