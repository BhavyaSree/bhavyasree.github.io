class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //operational errors
    // we will be sending error messages only for operational errors, especially in production for clients

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
