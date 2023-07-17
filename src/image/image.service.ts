import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { PrismaClient } from '@prisma/client';
import { Response } from 'express';

@Injectable()
export class ImageService {
  private prisma = new PrismaClient();

  async getListImages(keyword: string, res: Response) {
    try {
      const imageList = await this.prisma.image.findMany({
        where: {
          title: {
            contains: keyword
          }
        }
      });

      return res.status(HttpStatus.OK).json({
        statusCode: 200,
        content: imageList
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDetailImage(imageId: number, res: Response) {
    try {
      const detailImage = await this.prisma.image.findFirst({
        where: {
          image_id: imageId
        },
        include: {
          user: true
        }
      });

      if (detailImage) {
        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: detailImage
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

  async uploadImage(createImageDto: CreateImageDto, imageUrl: string, res: Response) {
    const {
      title,
      description,
      userId
    } = createImageDto;

    try {
      const user = await this.prisma.user.findFirst({
        where: {
          user_id: Number(userId)
        }
      });

      if (user) {
        await this.prisma.image.create({
          data: {
            title,
            url: imageUrl,
            description,
            user_id: Number(userId)
          }
        });

        return res.status(HttpStatus.CREATED).json({
          statusCode: 201,
          message: "Create image successfully"
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
