import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepo } from '../domain/repos/users.repo';
import { SecurityService } from '../libs/security/security.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepo,
    private readonly securityService: SecurityService,
  ) {}

  async findUserByEmail(email: string) {
    return await this.usersRepo.findUserByEmail(email);
  }

  async findUserByEmailAndPassword(
    user: Pick<User, 'email' | 'password' | 'refresh_token'>,
  ) {
    const entity = await this.usersRepo.findUserByEmail(user.email);

    if (!entity) {
      throw new BadRequestException('Wrong credentials!');
    }

    const passwordsMatch = await this.securityService.comparePasswords(
      user.password,
      entity.password,
    );

    if (!passwordsMatch) {
      throw new BadRequestException('Wrong credentials!');
    }
    return entity;
  }

  async createNewUser(user: Partial<User>) {
    const hashedPassword = await this.securityService.hashPassword(
      user.password,
    );
    return await this.usersRepo.createUser({
      id: user.id,
      email: user.email,
      password: hashedPassword,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  }
}
