class customErrorHandler extends Error {
  constructor(message, errors) {
    super(message);
    this.statusCode = 400;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default customErrorHandler;
