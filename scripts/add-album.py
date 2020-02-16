import argparse
import boto3
from botocore.client import ClientError
from datetime import datetime
from io import BytesIO
import math
import os
import json
import stringcase
import unidecode
from wand.image import Image


def arg_parsing():
    """Parses the arguments given to the script and returns them."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--albums-list", help="Path to the JSON file containing the albums list. If it is the first "
                                              "time  you are running this script, you set the path to a non-existant "
                                              "file and it will create the JSON file for you", required=True)
    parser.add_argument("--album-folder", help="Path to the folder containing the pictures you want to create the "
                                               "album from", required=True)
    parser.add_argument("--album-name", help="Name of the new album", required=True)
    parser.add_argument("--bucket-name", help="Name of AWS S3 bucket the album will be uploaded to", required=True)
    parser.add_argument("--cloudfront-id", help="ID of the CloudFront distribution pointing to the S3 bucket.\n"
                                                "If set, the pictures in the JSON will be fetched from the "
                                                "distribution's Domain Name")
    parser.add_argument("--fullsize-ratio", type=float, help="If set, the ratio at which the fullsize pictures are "
                                                             "reduced. For example, 0.3 will reduce a 24MP picture "
                                                             "30 percent into a ~8MP picture.")
    parser.add_argument("--thumbnail-ratio", type=float, default=0.1, help="Ratio at which the thumbnail pictures are "
                                                                           "reduced from the original picture. Default"
                                                                           "is 0.1 (10 percent the original size)")

    return parser.parse_args()


def init_bucket(args):
    """Inits the S3 and S3 client"""
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
    cloudfront = boto3.client('cloudfront')
    try:
        distribution = cloudfront.get_distribution(Id=cloudfront_id)["Distribution"]
        base_url = f'https://{distribution["DomainName"]}/{album_id}'
    except ClientError:
        print(f'Cloudfront distribution {cloudfront_id} does not exist or you do not have access to it.')
        print("Using the S3 bucket URL instead")
    return cloudfront, distribution["Id"], base_url


def convert_and_upload_picture(pic: Image, path, filename, ratio, s3_client, args):
    if ratio:
        pic.resize(
          int(pic.width * ratio),
          int(pic.height * ratio)
        )
    upload_picture(pic, path, filename, s3_client, args)
    return pic.width, pic.height


def upload_picture(pic, path, filename, s3_client, args):
    s3_client.upload_fileobj(
      BytesIO(pic.make_blob('jpeg')),
      args.bucket_name,
      f'{path}/{filename}',
      ExtraArgs={'ACL': 'public-read'})


def treat_picture(album_id, album_json, args, base_url, counter, picture, s3_client):
    picture_filename = os.path.basename(picture)

    # Open the picture using Wand / ImageMagick
    with Image(filename=picture) as img:
        with img.clone() as thumbnail:
            thumbnail_width, thumbnail_height = convert_and_upload_picture(thumbnail, f'{album_id}/thumbnails',
                                                                           picture_filename, args.thumbnail_ratio,
                                                                           s3_client, args)

        width, height = convert_and_upload_picture(img, album_id, picture_filename, args.fullsize_ratio, s3_client,
                                                   args)

        album_json['pictures'].append({
          'id': f'{counter}',
          'thumbnail': {
            'url': f'{base_url}/thumbnails/{picture_filename}',
            'height': thumbnail_height,
            'width': thumbnail_width
          },
          'fullsize': {
            'url': f'{base_url}/{picture_filename}',
            'height': height,
            'width': width
          }
        })


def main():
    args = arg_parsing()
    # Album ID = Album name in lowercase, without any space nor accent
    album_id = unidecode.unidecode(stringcase.alphanumcase(args.album_name).lower())

    # Check that album_folder exists
    if not os.path.isdir(args.album_folder):
        print(f'ERROR: {args.album_folder} is not a folder')
        exit(1)

    s3, s3_client = init_bucket(args)

    print(f'Reading the files in {args.album_folder}')
    # Create an array containing the path to each picture
    pictures = []
    for r, d, f in os.walk(args.album_folder):
        for file in f:
            if '.jpg' in file:
                pictures.append(os.path.join(r, file))

    if not len(pictures):
        print(f'ERROR: no JPG files found in {args.album_folder}')
        exit(1)

    album_json = {
      'id': album_id,
      'name': args.album_name,
      'pictures': []
    }
    counter = 1

    # Setting Cloudfront and base URL
    base_url = f'https://{args.bucket_name}.s3.amazonaws.com/{album_id}'
    if args.cloudfront_id:
        cloudfront, distribution_id, base_url = init_cloudfront(args.cloudfront_id, album_id)

    for picture in sorted(pictures):
        print(f'\nWorking on image {counter} out of {len(pictures)}')
        treat_picture(album_id, album_json, args, base_url, counter, picture, s3_client)
        counter += 1

    print("\nUploading the album's JSON file to S3")
    json_obj = s3.Object(args.bucket_name, f'{album_id}/album.json')
    json_obj.put(Body=json.dumps(album_json), ACL='public-read')

    if args.cloudfront_id:
        print(f'\nInvalidating Cloudfront distribution {distribution_id}')
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

    print(f'\nAppending album to {args.albums_list}')
    try:
        with open(args.albums_list, 'r', encoding='utf-8') as albums_list_file:
            albums_list = json.load(albums_list_file)
        albums_list_file.close()
    except FileNotFoundError:
        print(f'{args.albums_list} does not exist, it is going to be created')
        albums_list = []
    except json.decoder.JSONDecodeError:
        print(f'{args.albums_list} is not a valid JSON file. Continue? (Y/n)')
        continuing = input()
        if continuing.capitalize() != "Y":
            exit(1)
        albums_list = []

    # Add the new album at the start of the list
    new_album = [{
      'id': album_id,
      'name': args.album_name,
      'thumbnail': album_json['pictures'][0]['thumbnail']
    }]
    new_album.extend(albums_list)

    # Write file
    with open(args.albums_list, 'w+', encoding='utf-8') as albums_list_file:
        json.dump(new_album, albums_list_file, ensure_ascii=False)
    albums_list_file.close()

    print("\nAlbum creation done!")
    print(f'Do not forget to upload {args.albums_list}')


main()
