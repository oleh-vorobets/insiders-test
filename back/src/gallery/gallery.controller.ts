import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUserId } from 'src/common/decorators';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUserId() userId: number,
  ) {
    const fileUrl = await this.galleryService.uploadImage(userId, file);
    return { url: fileUrl };
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getImages(@CurrentUserId() userId: number) {
    return await this.galleryService.getImages(userId);
  }
}
