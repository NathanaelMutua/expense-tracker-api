# Expense Tracker API

**Task:** Implement an Expense Tracker API with Node.js / Express and Prisma

**Requirements:**

1. **Data Model**

    - Create a Prisma model for expenses with:
        - `amount` (float, required)
        - `description` (string, required)
        - `category` (string, optional)
        - Automatic `createdAt` timestamp
2. **Core Functionality**

    - `POST /expenses`
        - Validate that amount is positive
        - Return 400 error for invalid data
    - `GET /expenses`
        - Add query parameters for filtering by `category` and `minAmount`
3. **Advanced Feature**

    - Implement `GET /expenses/summary` that returns:
        - Total sum of all expenses
        - Sum grouped by category

**Deliverables:**

1. Complete `schema.prisma` file
2. Express route implementations
3. Example curl commands to test endpoints / postman
