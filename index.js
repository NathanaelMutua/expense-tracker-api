import express from "express"; // getting all libraries for express - will help in creating a server and routing
import { PrismaClient } from "@prisma/client"; // helps us interact with the database

const app = express(); //initialize the express.js app
const myPrisma = new PrismaClient(); //creates new client instance
app.use(express.json()); // a middleware that parses incoming requests with JSON payloads and makes the parsed data available in req.body

// my CRUD operations start here

// this is my post request to create an expense
app.post("/expenses", async (req, res) => {
  try {
    // console.log(req.body)
    const { amount, description, category } = req.body; // this gets the data I will input into postman
    if (amount < 0) {
      return res.status(400).json({ message: "Amount is a negative value" });
    }
    const newExpense = await myPrisma.expenses.create({
      data: {
        amount,
        description,
        category,
      },
    });
    res
      .status(201)
      .json({ message: "New Expense added successfully", newExpense });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Something Went Wrong!" });
  }
});

// my get request to get all expense records
app.get("/expenses", async (_req, res) => {
  try {
    const expenseData = await myPrisma.expenses.findMany({
      where: {
        isDeleted: false, //this will get all the expenses that have not undergone soft deletion
      },
    });
    res
      .status(200)
      .json({ message: "Retrieved All The Expense Records", expenseData });
  } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!" });
  }
});

// My get request to query a specific expense based on the id of the expense
app.get("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const specificExpense = await myPrisma.expenses.findFirst({
      where: {
        id, // we don't need to specify the value as it is the same as the
      },
    });
    res
      .status(200)
      .json({
        message: "Specific Expense Has Been Retrieved",
        specificExpense,
      });
  } catch (e) {
    res.status(404).json({ message: "Something Went Wrong!" });
  }
});

// Below is my endpoint to update an expense using PATCH request and update() method
app.patch("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;
    const updatedExpense = await myPrisma.expenses.update({
      where: {
        id,
      },
      data: {
        amount,
        description,
        category,
      },
    });
    res
      .status(200)
      .json({ message: "Expense Updated Successfully", updatedExpense });
  } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!!" });
    console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
  }
});

// Below is my DELETE request that will perform a soft delete on a specified expense record
app.delete("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await myPrisma.expenses.update({
      where: {
        id,
      },
      data: {
        isDeleted: true, // this changes the state of deletion to true, all the get responses filter out the records with truth values in this field
      },
    });
    res
      .status(200)
      .json({ message: "Expense Record Deleted Successfully", deletedExpense });
  } catch (e) {
    res.status(404).json({ message: "Something Went Wrong!" });
    console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
  }
});

// below is a get request where we will request for the sum of all amount values in the databas
// app.get("/expenses/summary", async (req, res) => {
// 	try{
// 		const sumedExpenses = await myPrisma.expenses.aggregate({
// 			where: {
// 				isDeleted: false
// 			}, _sum: {
// 				amount: true
// 			}
// 		})
//     res.status(200).json({ message: "Sum of All Expenses Extracted", sum: sumedExpenses._sum.amount })
// 	} catch (e) {
// 		res.status(400).json({ message: "Something Went Wrong!" })
// 		console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
// 	}
// });

// My port apparatus starts here
// This is where the server will be listening on
const port = 7070;

app.listen(port, () => {
  console.log(`My app is listening on port ${port}`);
});
