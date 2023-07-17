import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SaveImageService {
  private prisma = new PrismaClient();

  async getSaveImageList(imageId: number, res: Response) {
    try {
      const checkImageExist = await this.prisma.image.findFirst({
        where: {
          image_id: imageId
        }
      });

      if (checkImageExist) {
        const saveImageList = await this.prisma.save_image.findMany({
          where: {
            image_id: imageId
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: saveImageList
        });
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

  async getSaveImageByUserId(imageId: number, userId: number, res: Response) {
    try {
      const checkImageExist = await this.prisma.image.findFirst({
        where: {
          image_id: imageId
        }
      });

      if (checkImageExist) {
        const saveImageDetail = await this.prisma.save_image.findMany({
          where: {
            image_id: imageId,
            user_id: userId
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: saveImageDetail
        });
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

  async saveImage(imageId: number, userId: number, res: Response) {
    try {
      const checkImageExist = await this.prisma.image.findFirst({
        where: {
          image_id: imageId
        }
      });
      const checkUserExist = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (checkImageExist && checkUserExist) {
        const saveImageDetail = await this.prisma.save_image.create({
          data: {
            user_id: userId,
            image_id: imageId,
            save_date: new Date()
          }
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          content: saveImageDetail,
          message: "Save image successfully"
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "Image ID or User ID do not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async unSaveImage(imageId: number, userId: number, res: Response) {
    try {
      const checkImageExist = await this.prisma.image.findFirst({
        where: {
          image_id: imageId
        }
      });
      const checkUserExist = await this.prisma.user.findFirst({
        where: {
          user_id: userId
        }
      });

      if (checkImageExist && checkUserExist) {
        const result = await this.prisma.save_image.delete({
          where: {
            user_id_image_id: {
              user_id: userId,
              image_id: imageId
            }
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: result,
          message: "Unsave image successfully"
        });
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          message: "Image ID or User ID do not exist"
        });
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
