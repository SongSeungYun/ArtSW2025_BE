import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<string[]> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    if (!bucketName) {
      throw new InternalServerErrorException('S3 bucket name is not configured.');
    }

    const uploadPromises = files.map(file => {
      const key = `${uuid()}-${file.originalname}`;
      const params = {
        Bucket: bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      return this.s3.upload(params).promise().then(data => data.Location);
    });

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files to S3:', error);
      throw new InternalServerErrorException('An error occurred during file upload.');
    }
  }
}
