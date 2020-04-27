import boto3
from botocore.client import ClientError
from datetime import datetime
from exif_lib import get_exif
from io import BytesIO
import json
import math
import os
from PIL import Image
from PIL import ImageOps
import stringcase
import unidecode


def get_album_id(album_name):
    """Album ID = Album name in lowercase, without any space nor accent"""
    return unidecode.unidecode(stringcase.alphanumcase(album_name).lower())


def init_bucket(args):
    """Inits the S3 client and checks that the bucket exists and is owned by the current user"""
    # Init s3 resource
    s3 = boto3.resource('s3')

    # Check that bucket exists
    s3_client = boto3.client('s3')
    try:
        s3_client.head_bucket(Bucket=args.bucket_name)
    except ClientError:
        print(f'Bucket {args.bucket_name} does not exist or you do not have access to it')
        exit(1)
    return s3, s3_client


def init_cloudfront(cloudfront_id, album_id):
    """Inits the Cloudfront client and checks that the distribution exists and is owned by the current user"""
    cloudfront = boto3.client('cloudfront')
    try:
        distribution = cloudfront.get_distribution(Id=cloudfront_id)["Distribution"]
        base_url = f'https://{distribution["DomainName"]}/{album_id}'
        return cloudfront, distribution["Id"], base_url
    except ClientError:
        print(f'Cloudfront distribution {cloudfront_id} does not exist or you do not have access to it.')
        exit(1)


def get_sizes(size):
    """Fetch the thumbnail sizes from sizes-XXXX.txt"""
    with open(size) as f:
        return list(map(lambda x: int(x), f.readlines()))


def get_picture_file_name_and_ext(picture):
    return os.path.splitext(os.path.basename(picture))


def open_picture(picture_path):
    """From a file, returns a rotated PIL Image and its filename"""
    picture_filename, file_ext = get_picture_file_name_and_ext(picture_path)

    with Image.open(picture_path) as img:
        # Orient the picture following EXIF data
        img = ImageOps.exif_transpose(img)
        return picture_filename, img


def fetch_picture_s3(bucket, picture_path, s3_client):
    print("Downloading picture… ", end='')
    file_byte_string = s3_client.get_object(Bucket=bucket, Key=picture_path)['Body'].read()
    return Image.open(BytesIO(file_byte_string))


def process_picture(album_id, picture_name, args, base_url, counter, image, s3_client):
    """Takes a picture, resizes it in different sizes, uploads them and return a JSON representation of the picture"""
    picture_json = {
        'id': f'{counter}',
        'thumbnail': {
            'default': {},
            'sizes': {
                'jpeg': [],
                'webp': []
            }
        },
        'fullsize': {
            'default': {},
            'sizes': {
                'jpeg': [],
                'webp': []
            }
        },
        'exif': get_exif(image)
    }

    print("Uploading thumbnails… ", end="")
    default_size = get_sizes("sizes-thumb.txt")[0]
    picture = thumbnail(image, default_size)
    path = f'thumbnails/{picture_name}.jpg'
    upload_picture(picture, album_id, path, 'jpeg', s3_client, args.bucket_name)
    picture_json['thumbnail']['default'] = get_image_json(f'{base_url}/{path}', picture)

    # Make thumbnails for each specified sizes
    for size in get_sizes("sizes-thumb.txt"):
        path = f'thumbnails/{picture_name}-{size}'
        picture = thumbnail(image, size)
        upload_picture(picture, album_id, f'{path}.jpg', 'jpeg', s3_client, args.bucket_name)
        upload_picture(picture, album_id, f'{path}.webp', 'webp', s3_client, args.bucket_name)
        picture_json['thumbnail']['sizes']['jpeg'].append(get_image_json(f'{base_url}/{path}.jpg', picture))
        picture_json['thumbnail']['sizes']['webp'].append(get_image_json(f'{base_url}/{path}.webp', picture))

    print("Uploading full sizes…")
    default_size = get_sizes("sizes-full.txt")[0]
    picture = thumbnail(image, default_size)
    path = f'{picture_name}.jpg'
    upload_picture(picture, album_id, path, 'jpeg', s3_client, args.bucket_name, True)
    picture_json['fullsize']['default'] = get_image_json(f'{base_url}/{path}', picture)

    for size in get_sizes("sizes-full.txt"):
        path = f'{picture_name}-{size}'
        picture = thumbnail(image, size)
        upload_picture(picture, album_id, f'{path}.jpg', 'jpeg', s3_client, args.bucket_name, True)
        upload_picture(picture, album_id, f'{path}.webp', 'webp', s3_client, args.bucket_name, True)
        picture_json['fullsize']['sizes']['jpeg'].append(get_image_json(f'{base_url}/{path}.jpg', picture))
        picture_json['fullsize']['sizes']['webp'].append(get_image_json(f'{base_url}/{path}.webp', picture))

    return picture_json


def get_image_json(url, image: Image):
    """JSON representation of a picture"""
    return {
        'url': url,
        'width': image.width,
        'height': image.height
    }


def thumbnail(image, width: int):
    """Resizes a picture to match the given width"""
    img = image.copy()
    size = (width, width * 10)    # Don't care about height
    img.thumbnail(size)
    return img


def upload_picture(image: Image, album_id, path, file_format, s3_client, bucket_name, fullsize=False):
    in_mem_file = BytesIO()
    if fullsize:
        image.save(in_mem_file, format=file_format, subsampling=0, quality=100)
    else:
        image.save(in_mem_file, format=file_format)
    in_mem_file.seek(0)
    s3_client.upload_fileobj(
        in_mem_file,
        bucket_name,
        f'{album_id}/{path}',
        ExtraArgs={'ACL': 'public-read'})


def upload_album_json(album_json, album_id, bucket_name, s3):
    json_obj = s3.Object(bucket_name, f'{album_id}/album.json')
    json_obj.put(Body=json.dumps(album_json, indent=4), ACL='public-read')


def invalidate_cloudfront(cloudfront, distribution_id, album_id):
    cloudfront.create_invalidation(
        DistributionId=distribution_id,
        InvalidationBatch={
            'Paths': {
                'Quantity': 1,
                'Items': [
                    f'/{album_id}/*',
                ]
            },
            'CallerReference': str(math.trunc(datetime.timestamp(datetime.now())))
        })
