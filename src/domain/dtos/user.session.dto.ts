import { IsEmail, IsString, IsUUID } from 'class-validator';

export class UserSessionDto {
  @IsUUID()
  id: string;
  @IsEmail()
  email: string;
  @IsString()
  refresh_token: string;

  public static fromPayload(dto: UserSessionDto): UserSessionDto {
    if (!dto) {
      return;
    }

    return {
      id: dto.id,
      email: dto.email,
      refresh_token: dto.refresh_token,
    };
  }
}
