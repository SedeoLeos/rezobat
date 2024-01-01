import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class StripRequestContextPipe implements PipeTransform {
  constructor(private params: string) {}
  transform(value: any) {
    return value;
  }
}
