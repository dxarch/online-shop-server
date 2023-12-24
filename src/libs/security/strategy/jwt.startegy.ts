import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserSessionDto } from '../../../domain/dtos/user.session.dto';
import { UsersRepo } from '../../../domain/repos/users.repo';
import { SecurityService } from '../security.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly securityService: SecurityService,
    private readonly usersRepo: UsersRepo,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECURITY_SECRET'),
    });
  }

  async validate(payload: UserSessionDto) {
    const user = await this.usersRepo.findOneById(payload.id);

    if (!user || !user.refresh_token) {
      throw new ForbiddenException('Access denied!');
    }

    return user;
  }
}
