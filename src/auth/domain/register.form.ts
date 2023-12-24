import { IsEmail, IsString, IsStrongPassword, validate } from 'class-validator';

export class RegisterForm {
  @IsEmail()
  email!: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password!: string;
  @IsString()
  first_name!: string;
  @IsString()
  last_name!: string;

  static from(form?: RegisterForm) {
    const it = new RegisterForm();
    it.email = form?.email;
    it.password = form?.password;
    it.first_name = form?.first_name;
    it.last_name = form?.last_name;
    return it;
  }

  static async validate(form: RegisterForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
