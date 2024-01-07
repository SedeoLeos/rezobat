import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { User } from 'src/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
