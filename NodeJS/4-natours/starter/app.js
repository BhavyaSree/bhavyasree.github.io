const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// To limit the requests from an IP address
const limiter = rateLimit({
  max: 100,
  windows: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// Body parser -- reading data from the body to req.body
// Body larger than 10kb won't be accepted
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
// "email": { "$gt": "" } selects all the users
app.use(mongoSanitize());
// For example - This will remove $ signs

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// This will clear up the query string
// sort=duration&sort=price.. only uses the last one, it sorts by price
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
// whitelisting the properties where we can allow duplicates in the query string
// duration=5&duration=9   -- this will select the duration with both 5 and 9

// Serving static files
// To access static files
app.use(express.static(`${__dirname}/public/`));

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 👋');
//   next();
// });

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// if the cursor comes to this point, it means the specified route is not handled
// Unhandled Routes  -- all represents all the http methods, * represents everything
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `can't find ${req.originalUrl} on this server!`,
  // });

  // creating an error - to test global error handler
  // const err = new Error(`can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
  // this skips all the middlewares and directly goes to global error handler
});

app.use(globalErrorHandler);

module.exports = app;
