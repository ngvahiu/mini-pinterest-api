import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentService {
  private prisma = new PrismaClient();

  async getCommentsImage(imageId: number, res: Response) {
    try {
      const checkImageExist = await this.prisma.image.findFirst({
        where: {
          image_id: imageId
        }
      });

      if (checkImageExist) {
        const commentList = await this.prisma.comment.findMany({
          where: {
            image_id: imageId
          }
        });

        return res.status(HttpStatus.OK).json({
          statusCode: 200,
          content: commentList
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

  async createComment(userId: number, imageId: number, content: string, res: Response) {
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
        const result = await this.prisma.comment.create({
          data: {
            user_id: userId,
            image_id: imageId,
            content,
            comment_date: new Date()
          }
        });

        if (result) {
          return res.status(HttpStatus.CREATED).json({
            statusCode: 201,
            message: "Create comment successfully",
            content: result
          });
        }
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
