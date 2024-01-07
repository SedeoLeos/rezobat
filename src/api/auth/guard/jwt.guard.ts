import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import {
  IS_REFRESH_KEY,
  IS_PUBLIC_KEY,
  ABILITY,
} from 'src/core/decorators/public.decorator';
import { AbilitysEnum, TokenI } from '../tools/token.builder';
import { User } from 'src/api/user/schemas/user.schema';

@Injectable()
export class Auth0Guard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private config_service: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('token introuvable');
    }
    const isRefresh = this.reflector.getAllAndOverride<boolean>(
      IS_REFRESH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isRefresh) {
      const secret = this.config_service.get('JWT_REFRESH_TOKEN_SECRET');
      return await this.verify(context, secret, token);
    }
    const secret = this.config_service.get('JWT_ACCESS_TOKEN_SECRET');
    return await this.verify(context, secret, token);
  }
  async verify(context: ExecutionContext, secret: string, token: string) {
    const request = context.switchToHttp().getRequest();
    try {
      const payload = await this.jwtService.verifyAsync<{ data: TokenI<User> }>(
        token,
        { secret },
      );
      const requiredAbilitys = this.reflector.getAllAndOverride<string[]>(
        ABILITY,
        [context.getHandler(), context.getClass()],
      );
      const { abilitys, user } = payload.data;
      if (!requiredAbilitys) {
        const found = abilitys.find(
          (value) => value == AbilitysEnum.DEFAULT_ABILITYS,
        );
        if (!found) {
          throw new UnauthorizedException();
        }
        request['user'] = user;
        return true;
      }
      request['user'] = user;
      return requiredAbilitys.some((abd) => abilitys?.includes(abd));

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const headers = request.headers as any;
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
