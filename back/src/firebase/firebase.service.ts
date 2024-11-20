import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseApp: admin.app.App,
  ) {}

  private storageBucket() {
    return this.firebaseApp.storage().bucket();
  }
  async upload(file: Express.Multer.File, userId: number): Promise<string> {
    try {
      const bucket = this.storageBucket();
      const bucketName = bucket.name;

      const fileName = `${userId}_${uuid()}_${file.originalname}`;
      const fileRef = this.storageBucket().file(fileName);

      await fileRef.save(file.buffer, {
        metadata: {
          contentType: file.mimetype,
        },
      });

      const encodedFileName = encodeURIComponent(fileName);

      return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFileName}?alt=media`;
    } catch (error) {
      console.log('firebase.service.ts upload method: ', error);
      throw error;
    }
  }

  async get(userId: number) {
    try {
      const bucket = this.storageBucket();
      const [files] = await bucket.getFiles({
        prefix: `${userId}_`,
      });

      return files.map((file) => {
        const encodedFileName = encodeURIComponent(file.name);
        const bucketName = bucket.name;

        return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFileName}?alt=media`;
      });
    } catch (error) {
      console.log('firebase.service.ts get method: ', error);
      throw error;
    }
  }
}
