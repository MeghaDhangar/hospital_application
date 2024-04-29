import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3client = new S3Client({
   region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
   credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
   },
})

async function uploadFileToS3(file, filename) {
   const fileBuffer = file
   console.log(filename, 'filename')

   const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
      Key: `${filename}`,
      Body: fileBuffer,
      // ACL: 'public-read',
      ContentType: file.name,
      // ContentEncoding: 'base64',
      // CacheControl: 'public, max-age=31536000'
   }

   const command = new PutObjectCommand(params)
   await s3client.send(command)
   return filename
}

export async function POST(request) {
   try {
      const formData = await request.formData()
      const file = formData.get('file')

      if (!file) {
         return NextResponse.json({ error: 'no file selected' })
      }

      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = await uploadFileToS3(buffer, file.name)

      const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${filename}`

      return NextResponse.json({ success: true, imageUrl })
   } catch (error) {
      return NextResponse.json({ error: 'error uploading file' })
   }
}

// add the functionality n this route that the image's url will also get in this ,
// adjust this code and provide the url as you mentioned in the above soultion that the viewimage is gettting the url of the image
