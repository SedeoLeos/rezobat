import { applyDecorators, UseInterceptors, UsePipes } from '@nestjs/common';
import {
  InjectUserInterceptor,
  paramsMapings,
} from './injector-primary.interceptor';
import { StripRequestContextPipe } from './primary-clean.pipe';

export function InjectPkToBody(param: paramsMapings) {
  return applyDecorators(InjectPkTo(param, 'body'));
}

export function InjectPkTo(
  param: paramsMapings,
  context: 'query' | 'body' | 'params',
) {
  console.log(param);
  return applyDecorators(
    UseInterceptors(new InjectUserInterceptor(param, context)),
    UsePipes(new StripRequestContextPipe(param.dtoField)),
  );
}
