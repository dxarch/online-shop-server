import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserSessionDto } from '../../domain/dtos/user.session.dto';
import { UsersRepo } from '../../domain/repos/users.repo';
import { ConfigService } from '@nestjs/config';
import { TokensDto } from '../../domain/dtos/tokens.dto';

@Injectable()
export class SecurityService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersRepo: UsersRepo,
  ) {}

  async hashPassword(password: string) {
    return argon2.hash(password);
  }

  async comparePasswords(plainPassword: string, hashedPassword: string) {
    return argon2.verify(hashedPassword, plainPassword);
  }

  async generateTokens(user: UserSessionDto) {
    const payload = UserSessionDto.fromPayload(user);

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECURITY_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('SECURITY_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
        ),
      }),
    ]);

    return {
      access_token,
      refresh_token,
    } as TokensDto;
  }

  async updateRefreshToken(id: string, newRefreshToken: string) {
    const user = this.usersRepo.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    let hashedOrNullRefreshToken = newRefreshToken
    if (newRefreshToken) {
      hashedOrNullRefreshToken = await argon2.hash(newRefreshToken);
    }

    return await this.usersRepo.updateUser(id, {
      refresh_token: hashedOrNullRefreshToken,
    });
  }
}
