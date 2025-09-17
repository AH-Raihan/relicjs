# RelicJS

<p align="center">
  <a href="https://www.npmjs.com/package/relicjs">
    <img src="https://img.shields.io/npm/v/relicjs.svg" alt="NPM Version">
  </a>
  <a href="https://github.com/AH-Raihan/express-laravel-scaffold">
    <img src="https://img.shields.io/github/license/AH-Raihan/express-laravel-scaffold" alt="License">
  </a>
</p>

RelicJS is a backend framework for Node.js that provides a Laravel-like structure and developer experience, designed for building robust and scalable applications with speed and elegance.

It combines the power and simplicity of Express.js with the productivity-enhancing features of modern frameworks, such as a powerful CLI, filesystem abstraction, task scheduling, and a built-in queue system.

## Philosophy

RelicJS aims to make the development process a pleasing one without sacrificing application functionality. It provides a pre-configured, feature-rich starting point, allowing you to focus on writing code that matters. Happy developers make the best code.

## Features

- **MVC Architecture:** Clean, organized, and scalable project structure.
- **Powerful CLI:** An `artisan`-like tool (`craft`) for generating controllers, models, queues, and more.
- **Filesystem Abstraction:** A simple, unified API for interacting with local and (eventually) cloud storage.
- **Task Scheduling:** A fluent, `node-cron`-based scheduler to run your background tasks on a timetable.
- **Built-in Queue System:** Offload long-running tasks to a background queue.
- **Production Optimizations:** Built-in commands (`config:cache`) to boost performance in production.
- **Advanced Routing:** A fluent, chainable route builder for creating groups, prefixes, and applying middleware.
- **Security-First:** Comes with `helmet` pre-configured for common security headers.

## Installation

Install the CLI globally using npm:

```bash
npm install -g relicjs
```

## Quick Start

1.  **Create a new project:**

    ```bash
    create-relic-app my-awesome-project
    ```

2.  **Navigate to your project directory:**

    ```bash
    cd my-awesome-project
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Configure your environment:**

    -   Copy the `.env.example` file to a new file named `.env`.
    -   Update the `.env` file with your database credentials.

5.  **Run database migrations:**

    ```bash
    node craft make:migration create_users_table
    npx knex migrate:latest
    ```

6.  **Start the development server:**

    ```bash
    npm start
    ```

Your application is now running at `http://localhost:3000`.

## The `craft` CLI

The generated project includes a powerful command-line tool to speed up your workflow.

-   **Cache Configuration:**
    ```bash
    node craft config:cache
    ```

-   **Create a Controller:**
    ```bash
    node craft make:controller PostController
    ```

-   **Create a Model:**
    ```bash
    node craft make:model Post
    ```
-   **Create a Queue Job:**
    ```bash
    node craft make:queue ProcessPayment
    ```

## Project Structure

```
my-awesome-project/
├── bootstrap/          # Caching and app initialization
├── config/             # Configuration files
├── controllers/        # Route handling logic
├── database/
│   └── migrations/     # Database migration files
├── lang/               # Language files for localization
├── lib/                # Core application libraries
├── middleware/         # Custom middleware
├── models/             # Database models
├── public/             # Static assets (CSS, JS, images)
├── queues/             # Job definitions for the queue system
├── routes/             # Application routes
├── scheduler/          # Task scheduling definitions
├── storage/            # Local file storage
├── stubs/              # Templates for the 'craft' CLI
├── views/              # Edge templates, layouts, and components
├── .env.example        # Example environment file
├── craft.js            # The artisan-like CLI tool
├── index.js            # Application entry point
└── package.json
```