//configuring access to the S3 bucket for images storing
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const region = process.env.BUCKET_REGION
const accessKeyId = process.env.BUCKET_ACCESS_KEY
const secretAccessKey = process.env.BUCKET_SECRET_KEY

const s3 = new S3Client ({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    }
})

module.exports = s3;