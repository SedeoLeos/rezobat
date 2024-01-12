import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';
@Injectable()
export class AppService {
  getHello(): Promise<string> {
    return argon.hash('1234');
  }
}
