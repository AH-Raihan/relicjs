require("dotenv").config();
require("./bootstrap/config"); // Ensure global.config is available
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const { engine } = require("express-edge");

const knex = require("knex");
const { Model } = require("objection");

// Initialize DB connection using the central config
const db = knex(
  global.config("database.knex")[global.config("app.env") || "development"]
);
Model.knex(db);

const viewHelpers = require("./middleware/viewHelpers"); // Corrected require
const Logger = require("./bootstrap/logger"); // Corrected require

// Initialize queue worker
// Queue workers are now run in a separate process via 'node craft queue:work'

const app = express();

// --- Core Middleware ---
app.use(helmet());

// View Helper Middleware
app.use(viewHelpers);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Configure Edge for production
if (global.config("app.env") === "production") {
  engine.configure({ cache: true });
}
app.use(engine);
app.set("views", path.join(__dirname, "views"));

// --- Routes ---
const registerRoutes = require("./routes"); // Moved require here
registerRoutes(app);

// --- 404 Not Found Handler ---
app.use((req, res, next) => {
  res.status(404).render("errors/404");
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  Logger.error(err.stack); // Use Logger
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong on the server!";

  res.status(statusCode).send(
    global.config("app.env") === "development"
      ? { error: true, message: message, stack: err.stack } // Detailed error in development
      : { error: true, message: "An unexpected error occurred." } // Generic error in production
  );
});

// --- Initialize Scheduler ---
// require("./scheduler/kernel");

// --- Start Server ---
app.listen(global.config("app.port"), () => {
  Logger.info(
    `Server is running in ${global.config("app.env")} mode on ${global.config(
      "app.url"
    )}`
  );
});
