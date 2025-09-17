require('dotenv').config();

/*
|--------------------------------------------------------------------------
| Database Connections
|--------------------------------------------------------------------------
|
| Here are each of the database connections setup for your application.
| Of course, examples of configuring each database platform that is
| supported by Knex is shown below to make development simple.
|
*/

const devConfig = {
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'relicjs',
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: './database/migrations'
    }
};

// Conditionally add the pool object based on the .env setting
if (process.env.DB_POOL_ENABLED === 'true') {
    devConfig.pool = {
        min: parseInt(process.env.DB_POOL_MIN, 10) || 2,
        max: parseInt(process.env.DB_POOL_MAX, 10) || 10,
    };
}

module.exports = {
    knex: {
        development: devConfig,
        // Add other environments like 'production' here
    },

    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    }
};