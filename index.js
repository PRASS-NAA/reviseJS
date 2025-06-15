import PromptSync from "prompt-sync";
import fs from "fs";
import chalk from "chalk";

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
        console.log(`${chalk.red(" dont give empty input please !! restart program ")}`);
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

const checkFormat = (date) =>
{
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
    console.log("Invalid format! Please use YYYY-MM-DD.");
    return false;  
    }

    let parsedDate = new Date(date);
    if(isNaN(parsedDate.getTime())) {
        console.log("Invalid date! Please enter a real date.");
        return false;
    }
    return true;   
}

const expenseTracker = () =>
{
    //this function is for basic expense tracking
    let expense = {};
    let date;
    let amount;
    let category;
    let note;
    
    let dateproceed = true;

    while(dateproceed)
    {
        let dateInput = prompt("Enter date (YYYY-MM-DD): ");
        inputEmptyChecker(dateInput);
        if(checkFormat(dateInput))
        {
            dateproceed = false;
            date = new Date(dateInput);
        }else{
            dateproceed = true;
        }
    
    }
    
    amount = parseInt(prompt("Enter the amount " ));
    inputEmptyChecker(amount);
    let proceed = true;
    while(proceed)
    {
        category = prompt("Enter the category of expenditure (food, clothes , household, fuel , taxis, others ) : ");
        inputEmptyChecker(category);
        const validCategories = ["food", "clothes", "household", "fuel", "taxis", "others"];
        if(!validCategories.includes(category.toLowerCase()))
        {
            console.log("enter a valid category !! ");
        }else{
            proceed = false;
        }
    }
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
        let category = prompt(`Enter the Category ${chalk.green("(food, clothes , household, fuel , taxis, others)")}`);
        inputEmptyChecker(category);
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

        console.log(`Expenses Made This Week (from ${chalk.red(sevenDaysAgo)} to ${chalk.red(today)} `);
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

        console.log(`Expenses made this month (from ${chalk.blue(oneMonthAgo)} to ${chalk.blue(today)} `);

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
    let choice = prompt(`Press ${chalk.green("1")} for listing all expenditures made , Press ${chalk.green("2")} for listing expenditure by specific category, Press ${chalk.green("3")} to list expenses made in last week, Press ${chalk.green("4")} to list expenses made in last month : `);

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
    const expenses = readJson();
    let groupedExpenses = {};
    let amountByEachGrp = {};

    let totalAmount = 0;
    for(let expense of expenses)
    {
        totalAmount = totalAmount+expense.amount;
        if (!groupedExpenses[expense.category]) 
        {
            groupedExpenses[expense.category] = [];
        }
        groupedExpenses[expense.category].push(expense);
    }
    

    for (let category in groupedExpenses) {
        amountByEachGrp[category] = sumofgrp(groupedExpenses[category]);
    }

    console.log(amountByEachGrp);

    for(let category in amountByEachGrp)
    {
        let amount = amountByEachGrp[category];

        let percent = ((amount/totalAmount) * 100).toFixed(2);

        const barLength = Math.round((amount / totalAmount) * 40);
        const bar = chalk.green("|".repeat(barLength));

        console.log(`${chalk.yellow(category)} ₹${amount.toFixed(2)} (${percent}%)  ${bar}`);
    }

    console.log("Total Amount Spent : ",chalk.green(totalAmount));
}

const sumofgrp = (expensearr) =>
{
    let sum = 0;

    for(let expense of expensearr)
    {
        sum = sum + expense.amount;
    }

    return sum;
}


console.log(" -- Welcome To My Expense Tracker Application -- ");

let start = true;
while(start)
{
    // this while loop ensure sthe program doesnt stop if user accidentialy types anythig except a,b,e
    let choice;
    console.log(` Press ${chalk.yellowBright("A")} for adding a new expense `);
    console.log(` Press ${chalk.green("B")} for seeing all expenses `);
    console.log(` Press ${chalk.red("C")} for analysis of your expense`)
    console.log(` Press ${chalk.blue("E")} to stop the program !! `);

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
        case "c" :
            analysis();
            break;       
        case "e":
            console.log(" Spend More , Live Happilly ");
            start = false;   
            break;
        default:
            console.log("invalid choice !! ");
                        
    }

}