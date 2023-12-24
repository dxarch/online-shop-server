import { AuthGuard } from '@nestjs/passport';
import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UserSessionDto } from '../../../domain/dtos/user.session.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserSessionDto;
  },
);

@Injectable()
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
  ) {
    super();
  }
}
