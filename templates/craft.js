#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const fs = require('fs-extra');
const path = require('path');
const { exec, fork } = require('child_process');

const stubsDir = path.join(__dirname, 'stubs');

// Helper to convert PascalCase to camelCase
const toCamelCase = (str) => str.charAt(0).toLowerCase() + str.slice(1);

// Helper to convert PascalCase to kebab-case
const toKebabCase = (str) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

// Helper to create a file from a stub
const makeFromStub = async (stubName, fileName, destDir, replacements = {}) => {
    const destPath = path.join(destDir, `${fileName}.js`);
    if (await fs.pathExists(destPath)) {
        console.error(` Error: ${destPath} already exists.`);
        return;
    }

    const stubPath = path.join(stubsDir, stubName);
    let content = await fs.readFile(stubPath, 'utf-8');

    Object.keys(replacements).forEach(key => {
        content = content.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
    });

    await fs.outputFile(destPath, content);
    console.log(` Created: ${destPath}`);
};

yargs(hideBin(process.argv))
  .scriptName("craft")
  .command('config:cache', 'Create a cache file for faster configuration loading', () => {}, async (argv) => {
    console.log('Caching configuration...');
    const configDir = path.join(__dirname, 'config');
    const cachePath = path.join(__dirname, 'bootstrap', 'cache', 'config.json');
    const config = {};

    try {
        const files = await fs.readdir(configDir);
        for (const file of files) {
            if (file.endsWith('.js')) {
                const configKey = path.basename(file, '.js');
                config[configKey] = require(path.join(configDir, file));
            }
        }

        await fs.outputJson(cachePath, config);
        console.log('Configuration cached successfully!');
    } catch (error) {
        console.error('Error caching configuration:', error);
    }
  })
  .command('config:clear', 'Remove the configuration cache file', () => {}, async (argv) => {
    console.log('Clearing configuration cache...');
    const cachePath = path.join(__dirname, 'bootstrap', 'cache', 'config.json');

    try {
        if (await fs.pathExists(cachePath)) {
            await fs.remove(cachePath);
            console.log('Configuration cache cleared!');
        } else {
            console.log('Configuration cache was not found.');
        }
    } catch (error) {
        console.error('Error clearing configuration cache:', error);
    }
  })
  .command('make:controller <name>', 'Create a new controller file', (yargs) => {
    return yargs.positional('name', {
      describe: 'Name of the controller (e.g., UserController)',
      type: 'string'
    });
  }, (argv) => {
    makeFromStub('controller.stub', argv.name, 'controllers', { name: argv.name });
  })
  .command('make:model <name>', 'Create a new model file', (yargs) => {
    return yargs.positional('name', {
      describe: 'Name of the model (e.g., Post)',
      type: 'string'
    });
  }, (argv) => {
    const modelName = argv.name.charAt(0).toUpperCase() + argv.name.slice(1);
    const tableName = modelName.toLowerCase() + 's';
    makeFromStub('model.stub', modelName, 'models', { modelName, tableName });
  })
  .command('make:middleware <name>', 'Create a new middleware file', (yargs) => {
    return yargs.positional('name', {
        describe: 'Name of the middleware (e.g., CheckAdmin)',
        type: 'string'
    });
  }, (argv) => {
    makeFromStub('middleware.stub', argv.name, 'middleware', { name: argv.name });
  })
  .command('make:migration <name>', 'Create a new database migration file', (yargs) => {
    return yargs.positional('name', {
        describe: 'Name of the migration (e.g., create_posts_table)',
        type: 'string'
    });
  }, (argv) => {
    console.log(`Running: npx knex migrate:make ${argv.name}`);
    exec(`npx knex migrate:make ${argv.name}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(stdout);
        if(stderr) console.error(stderr);
    });
  })
  .command('make:queue <name>', 'Create a new queue worker file', (yargs) => {
    return yargs.positional('name', {
        describe: 'Name of the queue (e.g., SendWelcomeEmail)',
        type: 'string'
    });
  }, (argv) => {
    const name = argv.name.charAt(0).toUpperCase() + argv.name.slice(1); // Ensure PascalCase
    const fileName = `${toCamelCase(name)}Queue`; // e.g., processPaymentQueue
    const replacements = {
        job_type: toKebabCase(name), // e.g., process-payment
    };
    makeFromStub('queue.stub', fileName, 'queues', replacements);
  })
  .demandCommand(1, 'You need to specify a command (e.g., make:controller).')
  .strict()
  .help()
  .argv;
gv.name.charAt(0).toUpperCase() + argv.name.slice(1); // Ensure PascalCase
    const fileName = `${toCamelCase(name)}Queue`; // e.g., processPaymentQueue
    const replacements = {
        job_type: toKebabCase(name), // e.g., process-payment
    };
    makeFromStub('queue.stub', fileName, 'queues', replacements);
  })
  .demandCommand(1, 'You need to specify a command (e.g., make:controller).')
  .strict()
  .help()
  .argv;
