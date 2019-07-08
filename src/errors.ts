export class CheckError extends Error {
  public data: any;
  constructor(data: any) {
    super(data);
    this.name = 'CheckError';
    this.data = data;
  }
}

export class ValueNotFound extends Error {
  public data: any;
  constructor(data: any) {
    super(data);
    this.name = 'ValueNotFound';
    this.data = data;
  }
}
