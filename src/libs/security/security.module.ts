import { Module } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersRepo } from '../../domain/repos/users.repo';
import { JwtStrategy } from './strategy/jwt.startegy';
import { PassportModule } from '@nestjs/passport';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN'),
        },
        secret: config.get<string>('SECURITY_SECRET'),
      }),
    }),
  ],
  providers: [SecurityService, UsersRepo, JwtStrategy, JwtGuard],
  exports: [SecurityService, JwtGuard],
})
export class SecurityModule {}
