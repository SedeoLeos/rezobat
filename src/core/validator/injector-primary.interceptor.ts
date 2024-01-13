import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
export interface paramsMapings {
  dtoField: string;
  paramsName: string;
}

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  constructor(
    private input: paramsMapings,
    private type?: NonNullable<'query' | 'body' | 'params'>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (this.type && request[this.type]) {
      request[this.type][this.input.paramsName] =
        request.params[this.input.paramsName];
      console.log('?????', request[this.type]);
    }
    return next.handle();
  }
}
