import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService
  ) { }
  prisma = new PrismaClient();

  async signIn(email: string, password: string, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email
        }
      });

      if (user) {
        if (user?.password === password) {
          const payload = { sub: user.user_id, email: user.email };
          const token = await this.jwtService.signAsync(payload);

          return res.status(HttpStatus.OK).json({
            statusCode: 200,
            message: 'Sign in successfully',
            token
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: 400, message: 'Wrong password' });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ statusCode: 404, message: 'User not found' });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signUp(email: string, password: string, fullname: string, age: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email
        }
      });

      if (!user) {
        // const hashPassword = bcrypt.hashSync(password, 5);
        await this.prisma.user.create({
          data: {
            email,
            password,
            fullname,
            age,
            avatar: null
          }
        });
        return res.status(HttpStatus.CREATED).json({ statusCode: 201, message: 'Sign up successfully' });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({ statusCode: 400, message: 'Email already existed' });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
