const config = require('./config');
const Logger = require('./logger');

const QUEUE_ENABLED = config.app.queue_enabled;

let Queue, Worker, QueueScheduler, Redis, connection;

if (QUEUE_ENABLED) {
  const BullMQ = require('bullmq');
  Queue = BullMQ.Queue;
  Worker = BullMQ.Worker;
  QueueScheduler = BullMQ.QueueScheduler;
  Redis = require('ioredis');

  connection = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    maxRetriesPerRequest: null
  });

  connection.on('error', (err) => {
    Logger.error('Redis connection error:', err);
  });

  Logger.info('Queue system enabled. Connecting to Redis...');
} else {
  Logger.warn('Queue system disabled. Jobs will not be processed.');

  // Dummy classes for when queue is disabled
  Queue = class DummyQueue {
    constructor(name, opts) {
      this.name = name;
      Logger.info(`Dummy Queue '${name}' created (queue system disabled).`);
    }
    async add(name, data, opts) {
      Logger.info(`Dummy Queue '${this.name}': Job '${name}' added (not processed - queue system disabled). Data:`, data);
      return { id: 'dummy-job-id', data };
    }
    async close() {
      Logger.info(`Dummy Queue '${this.name}': close called.`);
    }
  };

  Worker = class DummyWorker {
    constructor(name, processor, opts) {
      this.name = name;
      Logger.info(`Dummy Worker for queue '${name}' created (queue system disabled).`);
    }
    on(event, listener) {
      // Do nothing
    }
    async close() {
      Logger.info(`Dummy Worker for queue '${this.name}': close called.`);
    }
  };

  QueueScheduler = class DummyQueueScheduler {
    constructor(name, opts) {
      this.name = name;
      Logger.info(`Dummy QueueScheduler for queue '${name}' created (queue system disabled).`);
    }
    async close() {
      Logger.info(`Dummy QueueScheduler for queue '${this.name}': close called.`);
    }
  };

  connection = {
    // Mimic ioredis connection interface for basic operations if needed
    // For this context, we just need a placeholder that doesn't throw errors
    on: (event, listener) => {},
    status: 'closed',
    disconnect: () => {},
    quit: () => {},
  };
}

const createQueue = (name) => {
  const queue = new Queue(name, { connection });
  if (QUEUE_ENABLED) {
    Logger.info(`BullMQ Queue '${name}' created.`);
  }
  return queue;
};

const createWorker = (name, processor) => {
  const worker = new Worker(name, processor, { connection });

  if (QUEUE_ENABLED) {
    worker.on('completed', (job) => {
      Logger.info(`Job ${job.id} in queue '${name}' completed.`);
    });

    worker.on('failed', (job, err) => {
      Logger.error(`Job ${job.id} in queue '${name}' failed:`, err);
    });

    worker.on('error', (err) => {
      Logger.error(`Worker for queue '${name}' encountered an error:`, err);
    });
    Logger.info(`BullMQ Worker for queue '${name}' created.`);
  }
  return worker;
};

module.exports = {
  createQueue,
  createWorker,
  connection,
  QueueScheduler, // Export QueueScheduler for worker.js
  QUEUE_ENABLED // Export the flag
};