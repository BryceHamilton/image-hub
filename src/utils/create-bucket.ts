import AWS from 'aws-sdk';
require('dotenv').config();

const { AWS_KEY_ID, AWS_SECRET_KEY, AWS_REGION, BUCKET_NAME } = process.env;

const s3 = new AWS.S3({
  accessKeyId: AWS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  region: AWS_REGION,
});

const createBucket = (bucketName: string) => {
  const params = {
    Bucket: bucketName,
  };

  s3.createBucket(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
  });
};

export default createBucket;
