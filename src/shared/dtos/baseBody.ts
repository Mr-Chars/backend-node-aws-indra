export class BaseBody<T> {

  success: boolean;
  message: string;
  data?: T;
  errors?: any;

  constructor(success: boolean, message: string, data?: T, errors?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  static success<T>(data: T, message: string): BaseBody<T> {
    return new BaseBody<T>(true,message, data);
  }

  static error(message: string, errors?: any): BaseBody<null> {
    return new BaseBody<null>(false, message, undefined, errors);
  }
}