import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class UserService {
  private prisma = new PrismaClient();

  async getUserDetail(userId: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (user) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: user
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "User ID does not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSaveImageList(userId: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (user) {
        const saveImageList = await this.prisma.user.findMany({
          where: {
            user_id: userId
          },
          select: {
            save_image: true
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: saveImageList
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "User ID does not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getImageList(userId: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (user) {
        const imageList = await this.prisma.user.findMany({
          where: {
            user_id: userId
          },
          select: {
            image: true
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: imageList
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "User ID does not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteImage(imageId: number, userId: number, res: Response) {
    try {
      const image = await this.prisma.image.findFirst({
        where: {
          image_id: imageId
        }
      });

      if (image) {
        if (image.user_id === userId) {
          //delete old file in server
          fs.unlinkSync(process.cwd() + "\\public\\img\\" + image.url);
          await this.prisma.image.delete({
            where: {
              image_id: imageId
            }
          });
          return res.status(HttpStatus.OK).json({
            statusCode: 200,
            message: "Delete image successfully"
          });
        } else {
          return res.status(HttpStatus.BAD_REQUEST).json({
            statusCode: 400,
            message: "This user is not allowed to delete image."
          });
        }
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "Image ID does not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserDetail(userId: number, updateUserDto: UpdateUserDto, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (user) {
        await this.prisma.user.update({
          where: {
            user_id: userId
          },
          data: updateUserDto
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: "Update user successfully"
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "User ID does not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserDetailUpload(userId: number, updateUserDto: UpdateUserDto, avatarUrl: string, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (user) {
        if (user.avatar) {
          //delete old file in server
          fs.unlinkSync(process.cwd() + "\\public\\avatar\\" + user.avatar);
        }
        await this.prisma.user.update({
          where: {
            user_id: userId
          },
          data: { ...updateUserDto, age: +updateUserDto.age, avatar: avatarUrl }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          message: "Update user upload successfully"
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "User ID does not exist"
        });
      }
    } catch (error) {
      console.log(error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadAvatar(imageUrl: string, userId: number, res: Response) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (user) {
        if (user.avatar) {
          //delete old file in server
          fs.unlinkSync(process.cwd() + "\\public\\avatar\\" + user.avatar);
        }
        await this.prisma.user.update({
          data: { ...user, avatar: imageUrl },
          where: {
            user_id: userId
          }
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: "Upload avatar successfully"
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "User ID does not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
