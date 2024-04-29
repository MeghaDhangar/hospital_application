/** @type {import('next').NextConfig} */
const nextConfig = {
   eslint: {
      dirs: ['pages', 'utils'], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
   },
   images: {
      domains: [
         'hospital0000.s3.ap-south-1.amazonaws.com',
         'fastly.picsum.photos',
         'img.freepik.com',
         'thumbs.dreamstime.com',
         'next.config.js',
         'hospital0000.s3.ap-south-1.amazonaws.com',
         'img.freepik.com',
         'png.pngtree.com',
         'www.carehospitals.com',
         'www.carehospitals.com',
         'img.freepik.com',
         't4.ftcdn.net',
         'i.pinimg.com',
         'media.istockphoto.com',
         'cdn.create.vista.com',
         'hospital0000.s3.ap-south-1.amazonaws.com',
         'www.carehospitals.com',
         'img.freepik.com',
         't4.ftcdn.net',
         't4.ftcdn.net',
         'i.pinimg.com',
         'media.istockphoto.com',
         'cdn.create.vista.com',
         'png.pngtree.com',
         'hospital0000.s3.amazonaws.com',
         'thumbs.dreamstime.com',
         "hospitalmanagementapplication.s3.amazonaws.com",
      ],
   },
}

module.exports = nextConfig
