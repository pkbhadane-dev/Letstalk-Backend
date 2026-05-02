
class validationError extends Error {
    constructor(message, errors) {
        super(message)
        this.name = "validationError"
        this.statusCode = 400 // for bad request
        this.errors = errors // store the array from validation errors
        Error.captureStackTrace(this, this.constructor)
    }
}

export default validationError