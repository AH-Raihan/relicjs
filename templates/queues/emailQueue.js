const { createQueue, QUEUE_ENABLED } = require('../bootstrap/queue');
const Logger = require('../bootstrap/logger');

const EMAIL_QUEUE_NAME = 'emails';
const emailQueue = createQueue(EMAIL_QUEUE_NAME);

/**
 * Dispatches a new job to the email queue.
 * @param {object} data - The data for the job.
 * @param {object} opts - Job options (e.g., delay, priority).
 */
const dispatch = async (data, opts = {}) => {
  try {
    await emailQueue.add(EMAIL_QUEUE_NAME, data, opts);
    if (QUEUE_ENABLED) {
      Logger.info(`Dispatched job to queue '${EMAIL_QUEUE_NAME}'`);
    }
  } catch (error) {
    Logger.error(`Failed to dispatch job to queue '${EMAIL_QUEUE_NAME}':`, error);
  }
};

module.exports = {
  emailQueue,
  dispatch
};
