# Backend Development Practice: Expense Tracker API

## Description

I formatted my API creation project into a question, you can follow along with me as we create it together.

---

## Requirements

Find the question in this document, [question.md](./question.md)

---

## Table of Contents

1. [Description](#description)
2. [Requirements](#requirements)
3. [Implementation Steps](#implementation-steps)
   1. [Project Setup](#1-project-setup)
   2. [Version Control](#2-version-control)
   3. [Node.js Setup](#3-nodejs-setup)
   4. [Dependencies Installation](#4-dependencies-installation)
   5. [Database Configuration](#5-database-configuration)
   6. [Prisma Schema](#6-prisma-schema)
   7. [Migration](#7-migration)
   8. [Package.json Configuration](#8-packagejson-configuration)
   9. [Generate Prisma Client](#9-generate-prisma-client)
4. [API Implementation](#api-implementation)
   1. [Server Setup](#1-server-setup)
   2. [CRUD Endpoints](#2-crud-endpoints)
      1. [POST /expenses](#post-expenses)
      2. [GET /expenses](#get-expenses)
      3. [GET /expenses/:id](#get-expensesid)
      4. [PATCH /expenses/:id](#patch-expenses-id)
      5. [DELETE /expenses/:id](#delete-expensesid)
      6. [GET /expenses/summary](#get-expensessummary)
      7. [GET /expenses/report](#get-expensesreport)
5. [Test Data](#test-data)
6. [Endpoint Summary](#endpoint-summary)

---

## Implementation Steps

### 1. Project Setup

1. Created a directory: `expenses-tracker` to hold our project files.
2. Created repository: [expense-tracker-api](https://github.com/NathanaelMutua/expense-tracker-api.git)
3. You can find my Postman workspace here: [Nathanael's Workspace](https://nathanael-7604382.postman.co/workspace/Nathanael's-Workspace~5b4242d0-11c7-4277-809b-10ca424c98a5/collection/45838328-0e7372c0-3d32-453d-9e49-1ee98759cd5d?action=share&creator=45838328)

### 2. Version Control

Initialized and setup my Github repository

```bash
git init
git remote add origin https://github.com/NathanaelMutua/expense-tracker-api.git
git remote -v
```

### 3. Node.js Setup

initialized Node.js to have my package.json file in the directory.

```bash
npm init -y
```

### 4. Dependencies Installation

```bash
npm install express
npm install prisma --save
npx prisma init
npm install @prisma/client
```

### 5. Database Configuration

In the `.env` file we will update the details as follows:

```sql
DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/DATABASE_NAME"
```

> We will revisit this environment variable to update it to the deployed database.

### 6. Prisma Schema

In our `schema.prisma` file we will create our model:

```prisma
model expenses {
  id          String   @id @default(uuid())
  amount      Int      @map("expense_amount")
  description String   @map("expense_description")
  category    String?  @map("expense_category")
  date        DateTime @default(now()) @map("date_filed")
  createdAt   DateTime @default(now()) @map("expense_creation_time")
  updatedAt   DateTime? @updatedAt @map("expense_update_time")
  isDeleted   Boolean  @default(false) @map("is_deleted")
}
```

### 7. Migration

We will now migrate our model to create the table in our database.

```bash
npx prisma migrate dev --name "add_the_expense_migration"
```

### 8. Package.json Configuration

We will add a few scripts to streamline our development

```json
{
  "type": "module",
  "scripts": {
    "format": "prettier --write .",
    "dev": "node --watch index.js",
    "prod": "node index.js"
  }
}
```

### 9. Generate Prisma Client

We will generate our client to allow us to communicate with our database.

```bash
npx prisma generate
```

---

## API Implementation

### 1. Server Setup

`index.js`:

```js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const myPrisma = new PrismaClient();
```

### 2. CRUD Endpoints

#### POST /expenses

This will create a new request from the request body content.

```js
app.post("/expenses", async (req, res) => {
  try {
    const { amount, description, category } = req.body; //gets the data we enter into postman
    if (amount < 0) {
      return res.status(400).json({ message: "Amount is a negative value" });
    }
    const newExpense = await myPrisma.expenses.create({
      data: { amount, description, category }
    });
    res.status(201).json({
      message: "New Expense added successfully", 
      newExpense
    });
  } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!" });
    console.log(e);
  }
});
```

#### GET /expenses

This will retrieve all the expenses from the database.

```js
app.get("/expenses", async (_req, res) => {
  try {
    const data = await myPrisma.expenses.findMany({
      where: { isDeleted: { equals: false } }
    });
    res.status(200).json({
      message: "Retrieved All The Expense Records",
      data
    });
  } catch (e) {
    res.status(400).json({ message: "Something Went Wrong" });
    console.log(e);
  }
});
```

#### GET /expenses/:id

This will find the first value(because the ID is unique, it's only one value) that meets the parameter value entered.

```js
app.get("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const specificExpense = await myPrisma.expenses.findFirst({
      where: { id }
    });
    res.status(200).json({
      message: "Specific Expense Has Been Retrieved",
      specificExpense
    });
  } catch (e) {
    res.status(404).json({ message: "Something Went Wrong!" });
    console.log(e);
  }
});
```

#### PATCH /expenses/:id

Will update a specific expense, with data from the request body.

```js
app.patch("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, category } = req.body;
    const updatedExpense = await myPrisma.expenses.update({
      where: { id },
      data: { amount, description, category }
    });
    res.status(200).json({
      message: "Expense Updated Successfully",
      updatedExpense
    });
  } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!!" });
    console.log(e);
  }
});
```

#### DELETE /expenses/:id

Will perform a soft-delete on an expense record, by updating the `isDeleted` field to `true`.

```js
app.delete("/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedExpense = await myPrisma.expenses.update({
      where: { id },
      data: { isDeleted: true }
    });
    res.status(200).json({
      message: "Expense Record Deleted Successfully",
      deletedExpense
    });
  } catch (e) {
    res.status(404).json({ message: "Something Went Wrong!" });
    console.log(e);
  }
});
```

#### GET /expenses/summary

This request will appear before the `app.get("/expenses/:id", async (_req, res)...` function, because as I have come to realize, specific get requests should come before dynamic requests.

The request will give us the total sum of all expenses, and also the total for each category.

```js
app.get("/expenses/summary", async (req, res) => {
  try {
    const summedExpenses = await myPrisma.expenses.aggregate({
      where: { isDeleted: false },
      _sum: { amount: true }
    });
    
    const sum = summedExpenses._sum.amount;

    const summedCategories = await myPrisma.expenses.groupBy({
      by: ['category'],
      where: { isDeleted: false },
      _sum: { amount: true }
    });
    
    res.status(200).json({
      message: "Sum of All Expenses Extracted",
      sum_of_all_expenses: sum,
      sum_by_category: summedCategories
    });
  } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!" });
  }
});
```

#### GET /expenses/report

Will give us the sum of a specific category.

This block will use the query parameters passed in the URL.

We will also use the groupBy() method, you can read more on aggregation, summary and grouping from the [prisma documentation](https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing).

```js
app.get("/expenses/report", async (req, res) => {
  try {
    const categoryGroup = req.query.category;
    const minAmount = Number(req.query.minAmount);
    
    const summarizedExpenses = await myPrisma.expenses.groupBy({
      by: ['category'],
      where: {
        isDeleted: false,
        category: { equals: categoryGroup },
        amount: { gte: minAmount }
      },
      _sum: { amount: true }
    });
    
    res.status(200).json({
      message: `Retrieved Sum of Expenses in category '${categoryGroup}'`,
      summarizedExpenses
    });
  } catch (e) {
    res.status(400).json({ message: "Something Went Wrong!" });
    console.log(e);
  }
});
```

---

## Test Data

Here's what I initially entered into Postman

```json
[
  {
    "amount": 1000,
    "description": "Subscribed to a new software service",
    "category": "tech"
  },
  {
    "amount": 800,
    "description": "Bought a new headset",
    "category": "tech"
  },
  {
    "amount": 500,
    "description": "Bought lettuce from the shop",
    "category": "groceries"
  },
  {
    "amount": 100,
    "description": "Bought bread from the bakery",
    "category": "groceries"
  },
  {
    "amount": 10000,
    "description": "Paid rent for the month",
    "category": "bills"
  },
  {
    "amount": 900,
    "description": "Paid the water bill for the month",
    "category": "bills"
  }
]
```

---

## Endpoint Summary

1. `POST /expenses` - Create new expense
2. `GET /expenses` - Retrieve all expenses
3. `GET /expenses/report` - Get expenses by category with min amount filter
4. `GET /expenses/summary` - Get total sum and category sums
5. `GET /expenses/:id` - Get specific expense
6. `PATCH /expenses/:id` - Update expense
7. `DELETE /expenses/:id` - Soft delete expense
