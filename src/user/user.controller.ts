import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, HttpCode, HttpStatus, Res, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileUploadDTO } from 'src/file-upload.dto';
import { UpdateUserUploadDto } from './dto/update-user-upload.dto';

let imageUrl: string = null;

@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@ApiTags("User")
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @HttpCode(HttpStatus.OK)
  @Get("get-detail/:userId")
  getUserDetail(@Param('userId') userId: string, @Res() res: Response) {
    return this.userService.getUserDetail(Number(userId), res);
  }

  @HttpCode(HttpStatus.OK)
  @Get("get-save-image-list/:userId")
  getSaveImageList(@Param('userId') userId: string, @Res() res: Response) {
    return this.userService.getSaveImageList(Number(userId), res);
  }

  @HttpCode(HttpStatus.OK)
  @Get("get-image-list/:userId")
  getImageList(@Param('userId') userId: string, @Res() res: Response) {
    return this.userService.getImageList(Number(userId), res);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("delete-image/:imageId/:userId")
  deleteImage(@Param('imageId') imageId: string, @Param('userId') userId: string, @Res() res: Response) {
    return this.userService.deleteImage(Number(imageId), Number(userId), res);
  }

  @HttpCode(HttpStatus.OK)
  @Put("update-user/:userId")
  updateUserDetail(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    return this.userService.updateUserDetail(Number(userId), updateUserDto, res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'avatar', type: UpdateUserUploadDto })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/avatar",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @HttpCode(HttpStatus.OK)
  @Put("update-user-upload/:userId")
  updateUserDetailUpload(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  ) avatar: Express.Multer.File, @Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
    return this.userService.updateUserDetailUpload(Number(userId), updateUserDto, imageUrl, res);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({ description: 'avatar', type: FileUploadDTO })
  @UseInterceptors(FileInterceptor("file", {
    storage: diskStorage({
      destination: process.cwd() + "/public/avatar",
      filename: (req, file, callback) => {
        imageUrl = new Date().getTime() + '_' + file.originalname;
        callback(null, imageUrl);
      }
    })
  }))
  @HttpCode(HttpStatus.CREATED)
  @Post("upload-avatar/:userId")
  uploadAvatar(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
      ],
    }),
  ) avatar: Express.Multer.File, @Param("userId") userId: string, @Res() res: Response) {
    return this.userService.uploadAvatar(imageUrl, Number(userId), res);
  }
}
