import argparse
import os
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

# TODO: check that bucket exists

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
            i.resize(int(i.width * 0.25), int(i.height * 0.25))
            i.save(filename=f'{args.album_folder}"/thumbnails/{picture_filename}')
    print(f'Adding {picture_filename} to {album_name}.json')
    album_json += {
      'id': "%d" % counter,
      'thumbnailUrl': s3Url + "thumbnails/" + picture_filename,
      'fullsizeUrl': s3Url + picture_filename
    }
    counter += 1

# TODO: save JSON
# TODO: upload to S3
# TODO: append album to album list
