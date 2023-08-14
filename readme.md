Of course, here's the `README.md` content as a single code block:

# MiniBudget API

An API service for the MiniBudget app, which helps users manage a virtual wallet and set a daily budget based on monthly expenses.

## Table of Contents
1. [Introduction](#introduction)
2. [Setup and Installation](#setup-and-installation)
3. [Running Tests](#running-tests)
4. [Roadmap](#roadmap)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction
The MiniBudget API serves as the backend for the MiniBudget app, allowing users to register daily incomes and manage their budget from multiple devices. The API is built using Node.js, Express.js, and connects to a PostgreSQL database through Sequelize.

## Setup and Installation

### Prerequisites:
- Node.js
- PostgreSQL

### Steps:
1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd minibudget-api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setting up PostgreSQL**:
   - Ensure PostgreSQL is installed and running.
   - Create a database named `minibudget`.
   - Set up the `postgres` user with the necessary password and permissions.

4. **Environment Configuration**:
   Make sure to create a `.env` file with relevant environment variables such as `DB_PASSWORD` for the PostgreSQL password. (For production, never commit this file to the repository.)

5. **Running the API**:
   ```bash
   npm start
   ```

## Running Tests
To ensure the functionality of the API, we have set up tests using Mocha and Chai.
Run the tests using:
```bash
npm test
```

## Roadmap
- Schema Design: Create tables for users, budgets, and transactions.
- ORM Models: Use Sequelize to create models representing these tables.
- API Endpoints: Implement routes for user registration, login, budget setup, and transactions.
- Security: Implement JWTs, use HTTPS, and sanitize inputs.

## Contributing
Feel free to fork this project, submit a pull request or report any issues!

## License
This project is licensed under the MIT License.
```

You can copy and paste the content directly into your `README.md` file.