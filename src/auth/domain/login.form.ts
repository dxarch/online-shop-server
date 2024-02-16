import { IsEmail, IsStrongPassword, validate } from 'class-validator';

export class LoginForm {
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
  refresh_token: string;

  static from(form?: LoginForm) {
    const it = new LoginForm();
    it.email = form?.email;
    it.password = form?.password;
    return it;
  }

  static async validate(form: LoginForm) {
    const errors = await validate(form);
    return errors.length ? errors : false;
  }
}
