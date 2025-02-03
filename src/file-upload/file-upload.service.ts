import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class FileUploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly cdnDomain: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.getOrThrow<string>('AWS_REGION');
    const accessKeyId =
      this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.getOrThrow<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName =
      this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
    this.cdnDomain = this.configService.getOrThrow<string>(
      'AWS_CLOUDFRONT_DOMAIN',
    );
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);
    return `https://${this.cdnDomain}/${path}`;
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    await this.s3Client.send(command);
  }

  getPublicUrl(path: string): string {
    return `https://${this.cdnDomain}/${path}`;
  }
}
