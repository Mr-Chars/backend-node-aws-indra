export class CustomException extends Error {
  public readonly statusCode: number;
  public readonly errors?: any;

  constructor(message: string, statusCode = 500, errors?: any) {
    super(message);
    this.name = "CustomException";
    this.statusCode = statusCode;
    this.errors = errors;

    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, CustomException);
    // }
  }
}