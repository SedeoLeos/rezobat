export class ResponseMessage<T> {
  public data: T;
  public message: string;

  constructor(data: T, message: string) {
    this.data = data;
    this.message = message;
  }
}
