"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomErrorReporter {
    constructor() {
        this.hasErrors = false;
        this.errors = {};
    }
    /**
     * VineJS calls the report method
     */
    report(message, rule, field, meta) {
        this.hasErrors = true;
        /**
         * Collecting errors as per the JSONAPI spec
         */
        this.errors[field.wildCardPath] = message;
    }
    /**
     * Creates and returns an instance of the
     * ValidationError class
     */
    createError() {
        return {
            name: 'ValidationError',
            message: 'Validation failed',
            messages: this.errors,
            status: 400,
            code: 'E_VALIDATION_ERROR',
            [Symbol.toStringTag]: 'ValidationError'
        };
    }
}
exports.default = CustomErrorReporter;
