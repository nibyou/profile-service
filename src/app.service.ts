import { Injectable } from '@nestjs/common';
import { JsonResponse } from '@nibyou/types';
import { Client } from 'minio';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from '@nestjs/swagger';

export class S3UrlResponse {
  @ApiProperty()
  upload: string;

  @ApiProperty()
  download: string;
}

@Injectable()
export class AppService {
  getHealth(): JsonResponse {
    const asTimeString = (uptime: number) => {
      const uptimeInSeconds = uptime % 60;
      let uptimeInMinutes = Math.floor(uptime / 60);
      let uptimeInHours = Math.floor(uptimeInMinutes / 60);
      const uptimeInDays = Math.floor(uptimeInHours / 24);
      uptimeInHours = uptimeInHours % 24;
      uptimeInMinutes = uptimeInMinutes % 60;
      return `${uptimeInDays}d ${uptimeInHours}h ${uptimeInMinutes}m ${uptimeInSeconds.toFixed(
        3,
      )}s`;
    };

    return new JsonResponse()
      .setMessage('healthy')
      .setData({ uptime: asTimeString(process.uptime()) });
  }

  async createPresignedImageUrl(
    fileExtension: string,
    bucketName?: string,
  ): Promise<S3UrlResponse> {
    if (!bucketName || !bucketName.startsWith('profile')) {
      bucketName = process.env.S3_BUCKET_NAME;
    }

    const minioClient = new Client({
      endPoint: process.env.S3_BASE_URL,
      port: parseInt(process.env.S3_PORT),
      useSSL: true,
      accessKey: process.env.S3_ACCESS_KEY,
      secretKey: process.env.S3_SECRET_KEY,
    });

    const uid = uuid();

    const upload = await minioClient.presignedPutObject(
      bucketName,
      `${uid}.${fileExtension}`,
      60,
    );

    return {
      upload,
      download: `${process.env.S3_DOWNLOAD_URL}/${bucketName}/${uid}.${fileExtension}`,
    } as S3UrlResponse;
  }
}
