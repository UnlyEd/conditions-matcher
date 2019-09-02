import ICheckError from '../interfaces/ICheckError';
import IValueNotFound from '../interfaces/IValueNotFound';

export class CheckError extends Error {
  public data: ICheckError;

  constructor(data: ICheckError) {
    super();
    this.name = 'CheckError';
    this.message = `CheckError: ${data.reason}`;
    this.data = data;
  }
}

export class ValueNotFound extends Error {
  public data: IValueNotFound;

  constructor(data: IValueNotFound) {
    super();
    this.name = 'ValueNotFound';
    this.data = data;
    this.message = `ValueNotFound:${data.reason}`;
  }
}
