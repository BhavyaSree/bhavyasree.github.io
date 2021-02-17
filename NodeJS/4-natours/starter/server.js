const mongoose = require('mongoose');
const dotenv = require('dotenv');

// handling uncaught errors Eg: console.log(x) -- x is not defined
// listening to uncaughtexception event
// This handler should be at first, as it should be applicable to whole code
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT REJECTION! 💥 Shutting down...');
  process.exit(1); // code 0 for success, 1 for unhandled exceptions
});
// If we have error in middleware, express goes to global error handling middleware.
// errors in middleware will be caught by global error handling middleware.

dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(app.get('env'));   // to get in which environment we are running

// console.log(process.env);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    //To avoid depecation warnings
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB Connection successful!'));

// testTour document is an instance of Tour model
// test - to create documents from code to the server (recheck in atlas)
// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// });

// const testTour = new Tour({
//   name: 'The Park camper',
//   price: 497,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR 💥:', err);
//   });

// SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// handling unhandled rejections, errors outside express like incorrect password to connect to DB
// Global handler for promise rejections
// Listening to unhandledRejection events and handling them
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1); // code 0 for success, 1 for unhandled exceptions
  });
});
