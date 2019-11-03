import argparse
import boto3
from botocore.client import ClientError
import os
import json
import stringcase
from wand.image import Image

parser = argparse.ArgumentParser()
parser.add_argument("--album-list", help="Path to the JSON file containing the albums list. If it is the first time "
                                         "you are running this script, you set the path to a non-existant file and "
                                         "it will create the JSON file for you", required=True)
parser.add_argument("--album-folder", help="Path to the folder containing the pictures you want to create the album "
                                           "from", required=True)
parser.add_argument("--album-name", help="Name of the new album", required=True)
parser.add_argument("--bucket-name", help="Name of AWS S3 bucket the album will be uploaded to", required=True)

args = parser.parse_args()

album_name = stringcase.alphanumcase(args.album_name).lower()

if not os.path.isdir(args.album_folder):
    print(f'ERROR: {args.album_folder} is not a folder')
    exit(1)

# Check that bucket exists
s3 = boto3.client('s3')
try:
    s3.head_bucket(Bucket=args.bucket_name)
except ClientError:
    print(f'Bucket {args.bucket_name} does not exist or you do not have access to it')
    exit(1)

print(f'Reading the files in {args.album_folder}')

pictures = []
for r, d, f in os.walk(args.album_folder):
    for file in f:
        if '.jpg' in file:
            pictures.append(os.path.join(r, file))

if not len(pictures):
    print(f'ERROR: not JPG files found in {args.album_folder}')
    exit(1)

print(f'Creating thumbnail folder at {args.album_folder}/thumbnails')
try:
    os.mkdir(args.album_folder + "/thumbnails")
except FileExistsError:
    print(f'Folder {args.album_folder}/thumbnails already exists, should we continue anyway? (y/n)')
    continuing = input()
    if continuing.capitalize() != "Y":
        exit(1)

album_json = []
counter = 1
s3Url = f'https://{args.bucket_name}.s3.amazonaws.com/{album_name}/'


for picture in pictures:
    print(f'Creating thumbnail for {picture}')
    picture_filename = os.path.basename(picture)
    with Image(filename=picture) as img:
        with img.clone() as i:
            i.resize(int(i.width * 0.10), int(i.height * 0.10))
            i.save(filename=f'{args.album_folder}/thumbnails/{picture_filename}')
    print(f'Adding {picture_filename} to album.json')
    album_json.append({
      'id': "%d" % counter,
      'thumbnailUrl': s3Url + "thumbnails/" + picture_filename,
      'fullsizeUrl': s3Url + picture_filename
    })
    counter += 1

# Save JSON containing the album's picture
os.makedirs(os.path.dirname("album.json"), exist_ok=True)
with open("album.json", 'w+', encoding='utf-8') as out_file:
    json.dump(album_json, out_file, ensure_ascii=False)
out_file.close()

# TODO: upload to S3
# TODO: append album to album list
