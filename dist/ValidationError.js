"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError {
    constructor(httpStatus, message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
    getErrorObj() {
        return { error: this.message };
    }
}
exports.default = ValidationError;
