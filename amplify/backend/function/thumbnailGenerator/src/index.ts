// amplify/backend/function/thumbnailGenerator/src/index.ts
import { S3Handler } from "aws-lambda";
import { S3 } from "aws-sdk";
import sharp from "sharp";

const s3 = new S3();

export const handler: S3Handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = record.s3.object.key;

    try {
      const image = await s3.getObject({ Bucket: bucket, Key: key }).promise();
      const buffer = image.Body as Buffer;

      // Generate thumbnails
      const smallThumbnail = await sharp(buffer).resize(100, 100).toBuffer();
      const largeThumbnail = await sharp(buffer).resize(500, 500).toBuffer();

      // Upload thumbnails to a different bucket/prefix
      await s3
        .putObject({
          Bucket:
            "amplify-awsamplifygen2-wi-wizzingtonproductimages2-eqfqxmvs6hfw",
          Key: `thumbnails/${key.replace(/\.\w+$/, "_small.webp")}`,
          Body: smallThumbnail,
          ContentType: "image/webp",
        })
        .promise();

      await s3
        .putObject({
          Bucket:
            "amplify-awsamplifygen2-wi-wizzingtonproductimages2-eqfqxmvs6hfw",
          Key: key,
          Body: largeThumbnail,
          ContentType: "image/webp",
        })
        .promise();
    } catch (error) {
      console.error("Error generating thumbnail:", error);
    }
  }
};
