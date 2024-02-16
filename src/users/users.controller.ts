import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser, JwtGuard } from '../libs/security/guards/jwt.guard';
import { User } from '@prisma/client';
import { UserSessionDto } from '../domain/dtos/user.session.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('/me')
  async me(@CurrentUser() user: User) {
    return user as UserSessionDto;
  }
}
