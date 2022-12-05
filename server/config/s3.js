//configuring access to the S3 bucket for images storing
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { v4: uuid } = require('uuid')
const sharp = require('sharp')

const bucketName = process.env.BUCKET_NAME
const region = process.env.BUCKET_REGION
const accessKeyId = process.env.BUCKET_ACCESS_KEY
const secretAccessKey = process.env.BUCKET_SECRET_KEY

const s3 = new S3Client({
    region,
    credentials: {
        accessKeyId,
        secretAccessKey,
    }
})

const uploadFile = async (file) => {
    const filename = uuid()//generate unique filename

    const fileBuffer = await sharp(file.buffer)
        .webp({ quality: 50 })
        .toBuffer()

    const uploadParams = {
        Bucket: bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: file.mimetype,
    }

    await s3.send(new PutObjectCommand(uploadParams))
    return filename
}

const deleteFile = async (filename) => {
    const deleteParams = {
        Bucket: bucketName,
        Key: filename,
    }

    await s3.send(new DeleteObjectCommand(deleteParams))
}

const getFile = async (filename) => {

    const getParams = {
        Bucket: bucketName,
        Key: filename,
    }

    const command = new GetObjectCommand(getParams)

    return await getSignedUrl(
        s3,
        command,
        { expiresIn: 120 }// signed url expiry in 120 seconds
    )
}

module.exports = { s3, uploadFile, deleteFile, getFile }