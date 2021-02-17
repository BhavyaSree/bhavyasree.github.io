// Global error handler
// by specifying four parameters, express knows that it is a error handling middleware
const AppError = require('../utils/appError');

// converting mongoose errors to operational errors, all AppErrors are set as operational
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use other value`;
  return new AppError(message, 400); // 400 for bad request
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token, Please login again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has been expired, Please login again!', 401);
};

// Errors based on the environment
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1. Log error
    console.error('ERROR 💥', err);
    // 2. Send a generic message
    res.status(500).json({
      status: 'error',
      message: 'something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  //console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // different error messages to different environments, (development or production)
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // for mongoose errors, converting mongoose errors to operational errors
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err }; // creating hard copy of err in error
    // if (error.name === 'CastError') {  //didn't work for me, so given other condition
    if (error.kind === 'ObjectId') {
      error = handleCastErrorDB(err);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }
    // if (error.name === 'ValidationError') { //again error.name is undefined for me, so given some other condition
    if (error._message === 'Validation failed') {
      error = handleValidationErrorDB(err);
    }
    // JSonwebtoken errors
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};
