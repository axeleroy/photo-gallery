import argparse
import boto3
from botocore.client import ClientError
from io import BytesIO
import os
import json
import stringcase
import unidecode
from wand.image import Image

parser = argparse.ArgumentParser()
parser.add_argument("--albums-list", help="Path to the JSON file containing the albums list. If it is the first time "
                                          "you are running this script, you set the path to a non-existant file and "
                                          "it will create the JSON file for you", required=True)
parser.add_argument("--album-folder", help="Path to the folder containing the pictures you want to create the album "
                                           "from", required=True)
parser.add_argument("--album-name", help="Name of the new album", required=True)
parser.add_argument("--bucket-name", help="Name of AWS S3 bucket the album will be uploaded to", required=True)
parser.add_argument("--cloudfront-domain", help="Domain of the CloudFront distribution pointing to the S3 bucket.\n"
                                                "Example: xxxxxxxx.cloudfront.net or sub.domain.tld if you added a "
                                                "CNAME to your CloudFront distribution.")
parser.add_argument("--fullsize-ratio", type=float, help="If set, the ratio at which the fullsize pictures are "
                                                         "reduced. For example, 0.3 will reduce a 24MP picture 30% "
                                                         "into a ~8MP picture.")
parser.add_argument("--thumbnail-ratio", type=float, default=0.1, help="Ratio at which the thumbnail pictures are "
                                                                       "reduced from the original picture. Default"
                                                                       "is 0.1 (10 percent the original size)")

args = parser.parse_args()

# Album ID = Album name in lowercase, without any space nor accent
album_id = unidecode.unidecode(stringcase.alphanumcase(args.album_name).lower())


# Check that album_folder exists
if not os.path.isdir(args.album_folder):
    print(f'ERROR: {args.album_folder} is not a folder')
    exit(1)

# Init s3 resource
s3 = boto3.resource('s3')

# Check that bucket exists
s3_client = boto3.client('s3')
try:
    s3_client.head_bucket(Bucket=args.bucket_name)
except ClientError:
    print(f'Bucket {args.bucket_name} does not exist or you do not have access to it')
    exit(1)


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
if args.cloudfront_domain:
    s3Url = f'https://{args.cloudfront_domain}/{album_id}'
else:
    s3Url = f'https://{args.bucket_name}.s3.amazonaws.com/{album_id}'


for picture in pictures:
    picture_filename = os.path.basename(picture)

    # Open the picture using Wand / ImageMagick
    with Image(filename=picture) as img:
        height = img.height
        width = img.width
        print(f'\nWorking on image {counter} out of {len(pictures)}')

        if args.fullsize_ratio:
            print(f'Reducing {picture_filename} to {int(args.fullsize_ratio * 100)} %')
            with img.clone() as fullsize:
                height = int(height * args.fullsize_ratio)
                width = int(width * args.fullsize_ratio)

                fullsize.resize(width, height)
                print(f'Uploading {picture_filename} to S3')
                s3_client.upload_fileobj(
                    BytesIO(fullsize.make_blob('jpeg')),
                    args.bucket_name,
                    f'{album_id}/{picture_filename}',
                    ExtraArgs={'ACL': 'public-read'})
        else:
            print(f'Uploading {picture_filename} to S3')
            s3_client.upload_file(
                picture,
                args.bucket_name,
                f'{album_id}/{picture_filename}',
                ExtraArgs={'ACL': 'public-read'})

        with img.clone() as thumbnail:
            print(f'Creating a thumbnail {int(args.thumbnail_ratio * 100)} % the size of the original')
            thumbnail_height = int(img.height * args.thumbnail_ratio)
            thumbnail_width = int(img.width * args.thumbnail_ratio)

            thumbnail.resize(thumbnail_width, thumbnail_height)
            print(f'Uploading thumbnail to S3')
            s3_client.upload_fileobj(
                BytesIO(thumbnail.make_blob('jpeg')),
                args.bucket_name,
                f'{album_id}/thumbnails/{picture_filename}',
                ExtraArgs={'ACL': 'public-read'})

        print(f'Adding {picture_filename} to album\'s JSON')
        album_json['pictures'].append({
            'id': f'{counter}',
            'thumbnail': {
                'url': f'{s3Url}/thumbnails/{picture_filename}',
                'height': thumbnail_height,
                'width': thumbnail_width
            },
            'fullsize': {
                'url': f'{s3Url}/{picture_filename}',
                'height': height,
                'width': width
            }
        })
    counter += 1

print("\nUploading the album's JSON file to S3")
json_obj = s3.Object(args.bucket_name, f'{album_id}/album.json')
json_obj.put(Body=json.dumps(album_json), ACL='public-read')


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
