import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Module({
  providers: [
    FirebaseService,
    FirebaseService,
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: async (configService: ConfigService) => {
        const serviceAccount = JSON.parse(
          configService.get<string>('FIREBASE_SERVICE_ACCOUNT'),
        );
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [FirebaseService],
})
export class FirebaseModule {}
