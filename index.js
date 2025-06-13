import express from 'express' // getting all libraries for express - will help in creating a server and routing
import { PrismaClient } from '@prisma/client' // helps us interact with the database

const app = express(); //initialize the express.js app
const myPrisma = new PrismaClient(); //creates new client instance
app.use(express.json()); // a middleware that parses incoming requests with JSON payloads and makes the parsed data available in req.body

// my CRUD operations start here

// this is my post request to create an expense
app.post("/expenses", async (req,res) => {
	try {
        // console.log(req.body)
		const {amount, description, category} = req.body; // this gets the data I will input into postman
		if (amount < 0){
			return res.status(400).json({ message: "Amount is a negative value" })
		}
		const newExpense = await myPrisma.expenses.create({
			data: {
				amount,
				description,
				category
			}
		})
		res.status(202).json({message: "New Expense added successfully", success: true, newExpense })
	} catch (e) {
		console.log(e);
		res.status(400).json({ message: "Something Went Wrong!" })
	}
})

// My port apparatus starts here
// This is where the server will be listening on
const port = 7070;

app.listen(port, () => {
    console.log(`My app is listening on port ${port}`);
})