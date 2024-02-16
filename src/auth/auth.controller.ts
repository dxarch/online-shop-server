import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterForm } from './domain/register.form';
import { LoginForm } from './domain/login.form';
import { SecurityService } from '../libs/security/security.service';
import { TokensDto } from '../domain/dtos/tokens.dto';
import { CurrentUser, JwtGuard } from '../libs/security/guards/jwt.guard';
import { User } from '@prisma/client';
import { OrdersService } from '../orders/orders.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService,
    private readonly orderService: OrdersService,
  ) {}

  @Post('/register')
  async register(@Body() body: RegisterForm) {
    const form = RegisterForm.from(body);
    const errors = await RegisterForm.validate(form);

    if (errors) {
      throw new BadRequestException('Invalid data!');
    }

    const existingUser = await this.authService.findUserByEmail(form.email);
    if (existingUser) {
      throw new BadRequestException('User already exists!');
    }

    const user = await this.authService.createNewUser(form);
    if (!user) {
      throw new UnprocessableEntityException('Error creating user entity');
    }

    await this.orderService.createCartOrderForUser(user);

    const tokens = await this.securityService.generateTokens(user);
    await this.securityService.updateRefreshToken(
      user.id,
      tokens.refresh_token,
    );
    return tokens as TokensDto;
  }

  @Post('/login')
  async login(@Body() body: LoginForm) {
    const form = LoginForm.from(body);
    const errors = await LoginForm.validate(form);

    if (errors) {
      throw new BadRequestException('Invalid data!');
    }

    const entity = await this.authService.findUserByEmailAndPassword(form);
    if (!entity) {
      throw new NotFoundException('User not found!');
    }

    const passwordsMatch = this.securityService.comparePasswords(
      form.password,
      entity.password,
    );

    if (!passwordsMatch) {
      throw new BadRequestException('Wrong credentials!');
    }

    const tokens = await this.securityService.generateTokens(entity);
    await this.securityService.updateRefreshToken(
      entity.id,
      tokens.refresh_token,
    );
    return tokens as TokensDto;
  }

  @UseGuards(JwtGuard)
  @Post('/logout')
  async logout(@CurrentUser() user: User) {
    await this.securityService.updateRefreshToken(user.id, null);
  }

  @UseGuards(JwtGuard)
  @Get('/refresh-token')
  async refreshToken(@CurrentUser() user: User) {
    const entity = await this.authService.findUserByEmail(user.email);
    if (!entity || !entity.refresh_token) {
      throw new ForbiddenException('Access denied!');
    }

    const refreshTokenMatches = entity.refresh_token === user.refresh_token;

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access denied!');
    }

    const tokens = await this.securityService.generateTokens(user);
    await this.securityService.updateRefreshToken(
      user.id,
      tokens.refresh_token,
    );

    return tokens;
  }
}
