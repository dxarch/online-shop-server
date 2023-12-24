import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepo } from '../domain/repos/users.repo';
import { SecurityModule } from '../libs/security/security.module';
import { PrismaModule } from '../libs/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [SecurityModule, PrismaModule, PassportModule, OrdersModule],
  controllers: [AuthController],
  providers: [AuthService, UsersRepo],
})
export class AuthModule {}
