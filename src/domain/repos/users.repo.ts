import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../../libs/prisma/prisma.service';

@Injectable()
export class UsersRepo {
  constructor(private readonly prisma: PrismaService) {}

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: string, data: Partial<User>) {
    return this.prisma.user.update({
      where: { id },
      data: data,
    });
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: { email },
    });
  }

  async createUser(
    user: Pick<User, 'id' | 'email' | 'first_name' | 'last_name' | 'password'>,
  ) {
    return this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        refresh_token: '',
      },
    });
  }
}
