# API Creation With Node.JS and Express.JS and Prisma(PostgreSQL)

## **Description**

I formatted my project into a question, you can follow along with me as we create it together.

---

## **Backend Development Practice Question**

**Task:** Implement an Expense Tracker API with Node.js / Express and Prisma

**Requirements:**

1. **Data Model**

    - Create a Prisma model for expenses with:
        - `amount` (float, required)
        - `description` (string, required)
        - `category` (string, optional)
        - Automatic `createdAt` timestamp
2. **Core Functionality**

    - `POST /expenses`
        - Validate that amount is positive
        - Return 400 error for invalid data
    - `GET /expenses`
        - Add query parameters for filtering by `category` and `minAmount`
3. **Advanced Feature**

    - Implement `GET /expenses/summary` that returns:
        - Total sum of all expenses
        - Sum grouped by category

**Deliverables:**

1. Complete `schema.prisma` file
2. Express route implementations
3. Example curl commands to test endpoints / postman

---

### **My Thoughts and Work Arounds**

1. Created a new directory: [expenses-tracker]("C:\Users\ADMIN\Documents\PROGRAMMING\projects\expense-tracker")
2. Created a  new repo: [expense-tracker-api](https://github.com/NathanaelMutua/expense-tracker-api.git)

3. You can also find my postman work space [right here](https://nathanael-7604382.postman.co/workspace/Nathanael's-Workspace~5b4242d0-11c7-4277-809b-10ca424c98a5/collection/45838328-0e7372c0-3d32-453d-9e49-1ee98759cd5d?action=share&creator=45838328)

4. Initialize a git repo in the directory:

    ```bash
    git init
    ```

5. Link GitHub repo to local file:

    ```bash
    git remote add origin https://github.com/NathanaelMutua/expense-tracker-api.git
    ```

6. Check if GitHub repo is connected:

    ```bash
    git remote -v
    ```

    - This should return the fetch and push URLs

7. Initialize a Node.js project, by adding a ```package.json``` file to your workspace.

    ```bash
    npm init -y
    ```

8. Install all the necessary dependencies:

9. Express ```npm install express```

10. Prisma ```npm install prisma --save```

    - I realized, that when I installed Prisma as a development dependency(```npm install prisma --save-dev```) it failed in deployment on Render, But I will come back to this.

    > NOTE: we will review the dependencies on deployment and REMEMBER to carry out the installation, generation and instantiation of the client.

 11. Initialize Prisma schema ```npx prisma init```, this creates a new directory ```Prisma``` that contains ```prisma.schema``` and ```.env``` file.
 4. Prisma Client ```npm install @prisma\client``` - We will review this process when we are done setting up our database.
 8. Add ```index.js``` file to the main directory to hold logic.
 9. Modify the ```.env``` file to have the correct database variable to my PostgreSQL

    ```sql
    DATABASE_URL = "postgresql://postgres:mypassword123@localhost:5432/expensesDB"
    ```

7. Modify ```prisma.schema``` to have our model.
 You can refer to the [Prisma Notes]([Models | Prisma](https://prisma-basics-notes.vercel.app/models.html#field-types))
 A model field has the syntax: fieldName datatype fieldTypeModifier Attributes
 The fields we need for this data base are...id, amount, description, category, date and createdAt

```sql
model expenses{

  id          String @id @default(uuid())

  amount      Int @map("expense_amount")

  description String @map("expense_description")

  category    String @map("expense_category")

  date        DateTime @default(now()) @map("date_filed")

  createdAt   DateTime @default(now()) @map("expense_creation_time")

}
```

16. Make my first migration of the model

```bash
npx prisma migrate dev --name "add the expense migration"
```

![Running \l and \c to see the model in the CLI](C:\Users\ADMIN\Pictures\Screenshots\Screenshot 2025-06-13 141617.png)

17. Make adjustments to my package.json file for compatibility and added ease of use.

- Add ```"type": "module",```
- Add

```json
...
"format": "prettier --write .",

    "dev": "node --watch index.js",

    "prod": "node index.js"
...
```

18. Let's revisit the Prisma Client. Let's generate it as follows: ```npx prisma generate```

19. Great, now let's dive into our index.js logic. First let's make all our necessary imports and initialization:

```js
import express from 'express' // getting all libraries for express - will help in creating a server and routing
import { PrismaClient } from '@prisma/client' // helps us interact with the database

const app = express(); //initialize the express.js app
const myPrisma = new PrismaClient(); //creates new client instance
```

20. Starting the CRUD operations

 1. Create: we will use POST request

 ```js
 app.post("/expenses", (req,res) => {
  const {amount, description, category} = req.body; // this gets the data I will input into postman
  if (amount < 0){
   return res.status(400).json({ message: "Amount is a negative value" })
  }
  const newExpense = await prisma.expenses.create({
   data: {
    amount,
    description,
    category
   }
  })
  res.status(202).json({message: "New Expense added successfully", success: true, newExpense })
 })
 ```

- Let's break down my POST request:

- "/expenses" is the endpoint
- req is a request for information that is passed as a parameter.
- we use async await as this is a function/action that has a promise.
- we assign the values: amount, description, and category to their exact variable names, by placing them in an object referring to the body of the request, which we will add data for in postman, to test the result.
- we now run an if condition to check if the value is negative, which as per the requirements, it shouldn't be.
- if the number is not negative, we now create our newExpense, by passing the values from the body as data
- we output a result that contains a success message and the created data.
- Let's implement a try-catch block:

  ```js
  app.post("/expenses", async (req,res) => {
   try {
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
    res.status(201).json({message: "New Expense added successfully", success: true, newExpense })
   } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!" })
    console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
   }
  })
  ```

- Great, we'll commit this and move onto the next feature.

- To get know-how of the status codes we can look into them [on this site by MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status).
- 201 - new resource created
- 200 - okay
- 400 - bad request
- 404 - not found
- 500 - Internal server error
- By the way, here is the code I am entering into my postman body:

  ```json
  {
      "amount": {{$randomInt}},
      "description": "{{$randomLoremSentence}}",
      "category": "{{$randomAdjective}}"
  }
  ```
  
 22. Getting all expenses:

- We will create a GET request and use the findMany() method.
- PS...I added the ```isDeleted``` field to my model for soft deletion.

 ```js
  app.get("/expenses", async (_req, res) => {
   try {
    const data = await myPrisma.expenses.findMany({
     where: {
      isDeleted: { eauqls: false }
     }
    })
    res.status(200).json({ message: "Retrieved All The Expense Records", data })
   } catch (e) {
    res.status(400).json({ message: "Something Went Wrong" })
    console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
   }
  });
 ```

- You also might be wondering what the ```_req``` means, right? So, because we're not making a request in this block of code, however, the request parameter is needed for the response parameter to function properly, to prevent unused code we place an underscore before the ```req``` parameter.

 23. Getting a specific expense,

- Here we will use the req.params to access the route parameter passed in the endpoint, this will be the specific expense ID.
- Here is the code:

 ```js
 app.get("/expenses/:id", async (req, res) => {
  try{
   const { id } = req.params;
   const specificExpense = await myPrisma.expenses.findFirst({
    where: {
     id // we don't need to specify the value as it is the same as the
    }
   })
   res.status(200).json({ message: "Specific Expense Has Been Retrieved", specificExpense })
  } catch (e) {
   res.status(404).json({ message: "Something Went Wrong!" })
   console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
  }
 });
 ```

- Note that in the function above we want to find the specific ID using a find method. There are 3 main find methods:

- **findUnique()**: this is used to retrieve a single record based on a unique identifier or id. (I think this would be a better alternative for what we have used).
- **findMany()**: this usually queries all the records in the model.
- **findFirst()**: returns the first record that meets certain criteria.

 24. Updating an Expense record:

- To carry this out, we will make a PATCH request with the update method, and it will be similar to getting a specific request, however, this time we will also be passing a value/data.
- Note that the difference between PUT and PATCH is that PUT updates the whole resource, and will require us to include all the information for the resource, however, PATCH updates whatever we specify ONLY.
- Note: I added the ```updatedAt``` field to my model in the ```schema.prisma``` file and made migrations. This will tell us when a record was updated.

  ```js

  app.patch("/expenses/:id", async (req, res) => {
   try{
    const { id } = req.params;
    const { amount, description, category } = req.body;
    const updatedExpense = await myPrisma.expenses.update({
    _sum: {
     amount: true
    }
    })
    res.status(200).json({ message: "Expense Updated Successfully", updatedExpense })
   } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!!" })
    console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
   }
  });
  ```

 25. Deleting an Expense.

- We will instantiate soft deletion, where we don't actually delete the record, but change the state of ```isdeleted``` field to ```true``` to have it as deleted.
- This is a key practice as data is very important and can and will be required for analysis and other important purposes.

 ```js
 app.delete("/expenses/:id", async (req, res) => {
  try{
   const { id } = req.params;
   const deletedExpense = await myPrisma.expenses.update({
    where: {
     id
    }, data: {
     isDeleted: true
    }
   })
   res.status(200).json({ message: "Expense Record Deleted Successfully", deletedExpense })
  } catch (e) {
   res.status(404).json({ message: "Something Went Wrong!" });
   console.log(e); //we will output the error just so we can troubleshoot the problem, incase it occurs
  }
 });
 ```

 26. Getting the sum of expenses:

- we will use the method aggregate.() on our amount field to get the sum.
- we will first ensure that we are carrying this out on records where the 'isDeleted' field is false.

 ```js
 app.get("/expenses/summary", async (req, res) => {
  try{
   const sumedExpenses = await myPrisma.expenses.aggregate({
    where: {
     isDeleted: false
    }, _sum: {
     amount: true
    }
   })
   res.status(200).json({ message: "Sum of All Expenses Extracted", aggregation._sum.amount})
  } catch (e) {
   res.status(400).json({ message: "Something Went Wrong!" })
  }
 });
 ```
