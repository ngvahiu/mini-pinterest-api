import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post("sign-in")
  signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password, res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("sign-up")
  signUp(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { email, password, fullname, age } = createUserDto;
    return this.authService.signUp(email, password, fullname, age, res);
  }
}
