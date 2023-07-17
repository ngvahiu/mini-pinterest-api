import { Controller, Get, Post, Body, Param, Res, UseGuards, HttpCode, HttpStatus, Query, UploadedFile, UseInterceptors, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';

let imageUrl: string = null;

@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@ApiTags("Image")
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) { }

  @HttpCode(HttpStatus.OK)
  @Get("get-list-images")
  @ApiQuery({ name: 'keyword', required: false, type: String })
  getListImages(@Query('keyword') keyword: string, @Res() res: Response) {
    return this.imageService.getListImages(keyword, res);
  }

  @HttpCode(HttpStatus.OK)
  @Get("detail-image/:imageId")
  getDetailImage(@Param('imageId') imageId: string, @Res() res: Response) {
    return this.imageService.getDetailImage(Number(imageId), res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'avatar', type: CreateImageDto })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/img",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @HttpCode(HttpStatus.CREATED)
  @Post("upload-image")
  uploadImage(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  ) image: Express.Multer.File, @Body() createImageDto: CreateImageDto, @Res() res: Response) {
    return this.imageService.uploadImage(createImageDto, imageUrl, res);
  }
}
