#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');

program
  .name('create-relic-app')
  .description('Scaffold a new Express.js project with a Laravel-like structure')
  .argument('<project-name>', 'The name of the project to create')
  .action(async (projectName) => {
    const projectPath = path.join(process.cwd(), projectName);
    const templatePath = path.join(__dirname, '..', 'templates');

    console.log(`Creating a new Express project in ${projectPath}...`);

    try {
      if (await fs.pathExists(projectPath)) {
        console.error(`Error: Directory '${projectName}' already exists.`);
        return;
      }

      await fs.copy(templatePath, projectPath);

      const packageJsonTemplatePath = path.join(projectPath, '_package.json');
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = await fs.readJson(packageJsonTemplatePath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      await fs.remove(packageJsonTemplatePath);

      const envTemplatePath = path.join(projectPath, '_env');
      const envPath = path.join(projectPath, '.env');
      let envContent = await fs.readFile(envTemplatePath, 'utf8');
      envContent = envContent.replace('{{DB_NAME}}', projectName.toLowerCase().replace(/ /g, '_'));
      await fs.writeFile(envPath, envContent);
      await fs.remove(envTemplatePath);

      const envExampleTemplatePath = path.join(projectPath, '_env.example');
      const envExamplePath = path.join(projectPath, '.env.example');
      await fs.move(envExampleTemplatePath, envExamplePath);

      console.log('RelicJS Project created successfully!');
      console.log('\nNext steps:');
      console.log(`  cd ${projectName}`);
      console.log('  npm install');
      console.log('  - Copy .env.example to .env and fill in your database credentials.');
      console.log('  - Run `npx knex migrate:latest` to set up the database tables.');
      console.log('  - Run `npm start` to launch the server.');

    } catch (error) {
      console.error('Error creating project:', error);
      if (await fs.pathExists(projectPath)) {
        await fs.remove(projectPath);
      }
    }
  });

program.parse(process.argv);