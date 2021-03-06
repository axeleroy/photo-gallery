import argparse
import os
import json

from album_lib import get_album_id
from album_lib import init_bucket
from album_lib import init_cloudfront
from album_lib import open_picture
from album_lib import process_picture
from album_lib import upload_album_json
from album_lib import invalidate_cloudfront


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

    return parser.parse_args()


def treat_picture(album_id, album_json, args, base_url, counter, picture, s3_client):
    picture_filename = os.path.basename(picture)
    img = open_picture(picture)
    album_json['pictures'].append(process_picture(album_id, picture_filename, args, base_url, counter, img, s3_client))


def main():
    args = arg_parsing()
    album_id = get_album_id(args.album_name)

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
            if '.jpg' in file.lower():
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
        filename, img = open_picture(picture)
        print(f'\nWorking on image {counter} out of {len(pictures)} ({filename})')
        album_json['pictures'].append(process_picture(album_id, filename, args, base_url, counter, img, s3_client))
        counter += 1

    print("\nUploading the album's JSON file to S3")
    upload_album_json(album_json, album_id, args.bucket_name, s3)

    if args.cloudfront_id:
        print(f'\nInvalidating Cloudfront distribution {distribution_id}')
        invalidate_cloudfront(cloudfront, distribution_id, album_id)

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
        json.dump(new_album, albums_list_file, ensure_ascii=False, indent=4)
    albums_list_file.close()

    print("\nAlbum creation done!")
    print(f'Do not forget to upload {args.albums_list}')


main()
