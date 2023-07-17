import { Controller, Get, Param, UseGuards, HttpCode, HttpStatus, Res, Post, Delete } from '@nestjs/common';
import { SaveImageService } from './save_image.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@ApiTags("Save-Image")
@Controller('save-image')
export class SaveImageController {
  constructor(private readonly saveImageService: SaveImageService) { }

  @HttpCode(HttpStatus.OK)
  @Get("/:imageId")
  getSaveImageList(@Param('imageId') imageId: string, @Res() res: Response) {
    return this.saveImageService.getSaveImageList(Number(imageId), res);
  }

  @HttpCode(HttpStatus.OK)
  @Get("/:imageId/:userId")
  getSaveImageByUserId(@Param('imageId') imageId: string, @Param('userId') userId: string, @Res() res: Response) {
    return this.saveImageService.getSaveImageByUserId(Number(imageId), Number(userId), res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("save/:imageId/:userId")
  saveImage(@Param('imageId') imageId: string, @Param('userId') userId: string, @Res() res: Response) {
    return this.saveImageService.saveImage(Number(imageId), Number(userId), res);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("unsave/:imageId/:userId")
  unSaveImage(@Param('imageId') imageId: string, @Param('userId') userId: string, @Res() res: Response) {
    return this.saveImageService.unSaveImage(Number(imageId), Number(userId), res);
  }
}
