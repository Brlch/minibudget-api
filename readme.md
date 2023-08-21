# MiniBudget API

The backend API for the MiniBudget mobile application. Helps users to manage their virtual wallet, track transactions, and set daily budgets based on monthly expenses.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Setting up Environment Variables](#setting-up-environment-variables)
  - [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Endpoints](#endpoints)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

## Features
- User registration and authentication
- Manage transactions (add, update, delete)
- Get budget summaries

## Technologies Used
- Node.js
- Express.js
- PostgreSQL
- Sequelize (ORM)
- JSON Web Tokens (JWT) for authentication

## Getting Started

### Prerequisites
- Node.js and npm installed
- PostgreSQL database

### Installation
1. Clone the repository:
    ```bash
    git clone [REPO_URL] minibudget-api
    cd minibudget-api
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Set up PostgreSQL:
    - Ensure PostgreSQL is installed and running.
    - Create a new database named `minibudget`.

### Setting up Environment Variables
- Create a `.env` file at the root level.
- Add the necessary environment variables. For instance:
    ```
    JWT_SECRET=your_jwt_secret
    DB_USERNAME=your_db_username
    DB_PASSWORD=your_db_password
    ```

### Running the Application
Start the API server:
```bash
npm start
```

## Running Tests
To ensure the integrity of the API, tests have been set up using Chai and Mocha. Run the tests with:
```bash
npm test
```

## Endpoints
- `/users`: Endpoint for user registration, retrieval, updating, and deletion.
- `/auth`: Endpoint for user authentication.
- `/transactions`: Endpoint to manage user transactions.

## Security
- Uses JSON Web Tokens (JWT) for user authentication.
- All passwords are hashed before being stored.
- Inputs are validated before processing to prevent SQL injection and other vulnerabilities.

## Contributing
We welcome contributions! Feel free to fork the repository and submit pull requests. For major changes, please open an issue first.

## License
MIT License.