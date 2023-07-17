import { Controller, Get, Post, Body, Param, UseGuards, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard("jwt"))
@ApiTags("Comment")
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @HttpCode(HttpStatus.OK)
  @Get("comments-image/:imageId")
  getCommentsImage(@Param('imageId') imageId: string, @Res() res: Response) {
    return this.commentService.getCommentsImage(Number(imageId), res);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("create-comment")
  createComment(@Body() createCommentDto: CreateCommentDto, @Res() res: Response) {
    const { userId, imageId, content } = createCommentDto;
    return this.commentService.createComment(userId, imageId, content, res);
  }
}
