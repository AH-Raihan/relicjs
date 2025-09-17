const cron = require('node-cron');
const Logger = require('../bootstrap/logger');

/*
|--------------------------------------------------------------------------
| Define The Application's Command Schedule
|--------------------------------------------------------------------------
|
| Here is where you can define all of your scheduled tasks. A common
| schedule is defined below to get you started.
|
*/

// Schedule a task to run every minute.
cron.schedule('* * * * *', () => {
  Logger.info('Running a task every minute');
  //
  // Add your task logic here.
  // For example, you could import a queue job and dispatch it:
  // const emailJob = require('../queues/emailQueue');
  // emailJob.dispatch({ to: 'example@example.com', content: 'Scheduled email' });
  //
});

console.log('Scheduler has been started.');


console.log('Scheduler has been started.');
