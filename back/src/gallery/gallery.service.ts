import { ForbiddenException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GalleryService {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseService: FirebaseService,
  ) {}
  async uploadImage(id: number, file: Express.Multer.File) {
    const user = await this.userService.findOneById(id);
    if (!user) {
      throw new ForbiddenException('Access denied');
    }
    if (user.isDeleted) {
      throw new ForbiddenException('Access denied');
    }

    const filePath = await this.firebaseService.upload(file, user.id);
    return filePath;
  }

  async getImages(id: number) {
    const links = await this.firebaseService.get(id);
    return { images: links };
  }
}
