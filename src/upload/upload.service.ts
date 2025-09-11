import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION')!;
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
    
    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async uploadFiles(files: Array<Express.Multer.File>): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}_${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }

  async deleteFiles(urls: string[]): Promise<void> {
    if (!urls || urls.length === 0) {
      return;
    }

    const keys = urls.map(url => url.substring(url.lastIndexOf('/') + 1));

    const command = new DeleteObjectsCommand({
      Bucket: this.bucketName,
      Delete: {
        Objects: keys.map(key => ({ Key: key })),
        Quiet: false,
      },
    });

    try {
      const { Errors } = await this.s3Client.send(command);
      if (Errors && Errors.length > 0) {
        // Log errors but don't throw an exception to allow DB deletion to proceed
        console.error('Error deleting some files from S3:', Errors);
      }
    } catch (error) {
      console.error('Error sending delete command to S3:', error);
      // Also don't throw, to allow DB deletion
    }
  }
}
