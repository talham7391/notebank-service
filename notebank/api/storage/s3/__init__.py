import boto3
from botocore.client import Config
import os

AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
AWS_S3_BUCKET_NAME = os.environ['AWS_S3_BUCKET_NAME']

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    config=Config(signature_version='s3v4'),
    region_name='us-east-2',
)


def generate_presigned_upload(storage_location):
    res = s3_client.generate_presigned_post(AWS_S3_BUCKET_NAME, storage_location)
    return {
        'url': res['url'],
        'fields': res['fields'],
    }


def generate_presigned_download(storage_location):
    url = s3_client.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': AWS_S3_BUCKET_NAME,
            'Key': storage_location,
        },
    )
    return url
