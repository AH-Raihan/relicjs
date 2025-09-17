#!/usr/bin/env node
// This script is intended to be run as a standalone process for queue workers.

// Ensure global.config is available
require('./bootstrap/config');
// Ensure Logger is available
const Logger = require('./bootstrap/logger');
const { createWorker, connection, QueueScheduler, QUEUE_ENABLED } = require('./bootstrap/queue');

if (!QUEUE_ENABLED) {
  Logger.warn('Queue system is disabled. Worker process will not start.');
  process.exit(0);
}

Logger.info('Starting queue worker process...');

// Define the job processor function for the email queue
const processEmailJob = async (job) => {
  const { email } = job.data;
  Logger.info(`Processing job ${job.id}: Sending welcome email to ${email}`);
  // Simulate an asynchronous task, e.g., sending an email
  await new Promise(resolve => setTimeout(resolve, 2000));
  Logger.info(`Welcome email sent to ${email}`);
  return { success: true, message: `Email sent to ${email}` };
};

// Create a worker for the email queue
const emailWorker = createWorker('emails', processEmailJob);
const emailQueueScheduler = new QueueScheduler('emails', { connection });

// Keep the process alive
process.on('SIGINT', async () => {
    Logger.info('Queue worker process received SIGINT. Shutting down...');
    await emailWorker.close();
    await emailQueueScheduler.close();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    Logger.info('Queue worker process received SIGTERM. Shutting down...');
    await emailWorker.close();
    await emailQueueScheduler.close();
    process.exit(0);
});

// Log unhandled rejections to the logger
process.on('unhandledRejection', (reason, promise) => {
    Logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Log uncaught exceptions to the logger
process.on('uncaughtException', (error) => {
    Logger.error('Uncaught Exception:', error);
    process.exit(1); // Exit after uncaught exception
});

Logger.info('Queue worker process started successfully.');
