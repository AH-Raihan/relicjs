const { validationResult } = require('express-validator');
  const User = require('../models/User');
  const Logger = require('../bootstrap/logger'); // Add Logger import
  const emailQueue = require('../queues/emailQueue'); // Add emailQueue import

  class UserController {
      /**
       * Display a list of all users.
       */
      async index(req, res, next) {
          try {
              const users = await User.query();
              const formattedUsers = users.map(user => ({
                  ...user,
                  created_at_formatted: new Date(user.created_at).toLocaleDateString()
              }));
              return res.render('index', {
                  users: formattedUsers
              });
          } catch (error) {
              Logger.error('Error in UserController.index:', error); // Use Logger
              next(error); // Pass errors to the global error handler
          }
      }

      /**
       * Store a newly created user in storage.
       */
      async store(req, res, next) {
          try {
              const errors = validationResult(req);
              if (!errors.isEmpty()) {
                  const users = await User.query();
                  return res.status(422).render('index', {
                      users: users,
                      errors: errors.array(),
                      old: req.body
                  });
              }

              const { name, email } = req.body;

              // Check if user with email already exists
              const existingUser = await User.query().findOne({ email });
              if (existingUser) {
                  const users = await User.query();
                  return res.status(409).render('index', {
                      users: users,
                      errors: [{ msg: 'Email already registered.' }],
                      old: req.body
                  });
              }

              const user = await User.query().insert({ name, email });

              // Enqueue a job to send a welcome email
              await emailQueue.dispatch({ job_type: 'emails', job_body: { email: user.email } });
              Logger.info(`Job enqueued for user ${user.email}`); // Use Logger

              return res.redirect('/');
          } catch (error) {
              Logger.error('Error in UserController.store:', error); // Use Logger
              next(error); // Pass errors to the global error handler
          }
      }
  }

  module.exports = new UserController();new UserController();