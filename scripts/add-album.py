import argparse
import boto3
from botocore.client import ClientError
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

args = parser.parse_args()

# Album ID = Album name in lowercase, without any space nor accent
album_id = unidecode.unidecode(stringcase.alphanumcase(args.album_name).lower())


# Check that album_folder exists
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
# Create an array containing the path to each picture
pictures = []
for r, d, f in os.walk(args.album_folder):
    for file in f:
        if '.jpg' in file:
            pictures.append(os.path.join(r, file))

if not len(pictures):
    print(f'ERROR: no JPG files found in {args.album_folder}')
    exit(1)


print(f'Creating thumbnail folder at {args.album_folder}/thumbnails')
try:
    os.mkdir(args.album_folder + "/thumbnails")
except FileExistsError:
    print(f'Folder {args.album_folder}/thumbnails already exists, should we continue anyway? (y/n)')
    continuing = input()
    if continuing.capitalize() != "Y":
        exit(1)

album_json = {
  'id': album_id,
  'name': args.album_name,
  'pictures': []
}
counter = 1
s3Url = f'https://{args.bucket_name}.s3.amazonaws.com/{album_id}'


for picture in pictures:
    picture_filename = os.path.basename(picture)
    print(f'Uploading {picture_filename} to S3')
    s3.upload_file(picture, args.bucket_name, f'{album_id}/{picture_filename}',
                   ExtraArgs={'ACL': 'public-read'})

    print(f'Creating thumbnail for {picture_filename}')

    thumbnail_path = f'{args.album_folder}/thumbnails/{picture_filename}'

    # Create the picture thumbnail at 15% size
    with Image(filename=picture) as img:
        with img.clone() as i:
            height = i.height
            width = i.width
            thumbnail_height = int(i.height * 0.15)
            thumbnail_width = int(i.width * 0.15)

            i.resize(thumbnail_width, thumbnail_height)
            i.save(filename=thumbnail_path)

    print(f'Uploading thumbnail to S3')
    s3.upload_file(thumbnail_path, args.bucket_name, f'{album_id}/thumbnails/{picture_filename}',
                   ExtraArgs={'ACL': 'public-read'})

    print(f'Adding {picture_filename} to album\'s JSON')
    album_json['pictures'].append({
      'id': "%d" % counter,
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

print("Saving album's JSON file")
# Save JSON containing the album's picture
with open(f'{args.album_folder}/album.json', 'w+', encoding='utf-8') as out_file:
    json.dump(album_json, out_file, ensure_ascii=False)
out_file.close()


print("Uploading the album's JSON file to S3")
s3.upload_file(f'{args.album_folder}/album.json', args.bucket_name, f'{album_id}/album.json',
               ExtraArgs={'ACL': 'public-read'})


print(f'Append album to {args.albums_list}')
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

print("Album creation done!")
print(f'Do not forget to upload {args.albums_list}')
print(f'You might want to delete {args.album_folder}/thumbnails from your filesystem')
