import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
});

/**
 * Upload a file to S3
 */
export async function uploadFile(
    buffer: Buffer | Uint8Array,
    key: string,
    contentType: string = "application/octet-stream"
): Promise<string> {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
    });

    await s3Client.send(command);

    // Return the public URL or s3:// path
    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<void> {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");

    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    await s3Client.send(command);
}

/**
 * Generate a signed URL for temporary access
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error("AWS_S3_BUCKET is not configured");

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
}

export default s3Client;
