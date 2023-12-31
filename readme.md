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
- [Automated Deployment](#automated-deployment)
- [API Documentation with Swagger](#api-documentation-with-swagger)
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
    JWT_SECRET=yourjwtsecret
    DB_USERNAME=yourdbusername
    DB_PASSWORD=yourpassword
    DB_DATABASE=yourdbname
    DB_HOST=127.0.0.1
    DB_DIALECT=postgres
    ```

### Running the Application
Start the API server:
```bash
npm start
```

## Database Migrations

### Creating a New Migration

Whenever you want to make changes to the database schema (like adding a new table or altering an existing one), create a new migration:

```bash
npm run migration:create -- --name your-migration-name
```

This will generate a new migration file inside the `migrations` folder. Define the desired changes within this file.

### Applying Migrations

```bash
npm run migrate
```

### Reverting Migrations

```bash
npm run migrate:undo
```


## Automated Deployment

The application is automatically deployed using GitHub Actions. For this setup to work, the following secrets must be added to your GitHub repository:

- `SERVER_SSH_KEY`: The SSH private key used to access the deployment server.
- `SERVER_IP`: The IP address of the deployment server.
- `SERVER_USER`: The SSH user for the deployment server.
- `SERVER_ENV_VARIABLES`: The environment variables required for your application. This should contain key-value pairs as you'd find in a `.env` file. 

Every push to the main branch will trigger this deployment process, which will:

1. Sync the latest codebase to the server.
2. Create (or replace) the `.env` file using the content from the `SERVER_ENV_VARIABLES` secret.
3. Install any new dependencies.
4. Restart the application using PM2.

## API Documentation with Swagger

The API documentation is auto-generated using `swagger-autogen`. The configuration and execution of this autogeneration is handled in the `middlewares/swaggerAutogen.js` file.

To access the API documentation, navigate to the root URL of the deployed application, e.g., `http://api.myminibudget.com`.

The main server file (`index.js`) integrates Swagger's UI middleware, which serves the auto-generated documentation using `swagger-ui-express`.

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
```

Replace `[REPO_URL]` with the actual URL of your repository. The README now includes information about the automated deployment process and the auto-generated API documentation using Swagger.