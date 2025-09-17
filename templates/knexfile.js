/*
|--------------------------------------------------------------------------
| Knexfile
|--------------------------------------------------------------------------
|
| This file is used by the Knex.js CLI tool to manage migrations.
| It loads its configuration from the main application config, ensuring
| consistency between the CLI and the running application.
|
*/
const { knex } = require('./bootstrap/config').database;

module.exports = knex;
