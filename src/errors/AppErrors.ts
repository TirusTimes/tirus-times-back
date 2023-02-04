import { StatusCodes } from 'http-status-codes';

export class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  constructor(message: string, statusCode = StatusCodes.BAD_GATEWAY) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
