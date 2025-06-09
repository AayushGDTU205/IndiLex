"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandler extends Error {
    constructor(statusCode, status, message = "internal server issue") {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        this.message = message;
        this.statusCode = statusCode;
        this.status = false;
    }
}
exports.default = ErrorHandler;
