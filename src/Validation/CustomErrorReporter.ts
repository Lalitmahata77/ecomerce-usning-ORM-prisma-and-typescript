import { errors } from "@vinejs/vine";

interface ErrorMeta {
    wildCardPath: string;
  }
  
  interface ValidationError extends Error {
    messages: { [key: string]: string };
    status: number;
    code: string;
    [Symbol.toStringTag]: string;

  }
  
  interface ErrorReporterContract {
    report(message: string, rule: string, field: ErrorMeta, meta: any): void;
    createError(): ValidationError;
  }
  
  class CustomErrorReporter implements ErrorReporterContract {
    private hasErrors: boolean = false;
    private errors: { [key: string]: string } = {};
  
    /**
     * VineJS calls the report method
     */
    report(message: string, rule: string, field: ErrorMeta, meta: any): void {
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
    createError(): ValidationError {
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
  
  export default CustomErrorReporter;