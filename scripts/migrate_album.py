import argparse
import json
import re

from album_lib import get_sizes
from album_lib import get_picture_file_name_and_ext
from album_lib import init_bucket
from album_lib import init_cloudfront
from album_lib import fetch_picture_s3
from album_lib import resize_and_upload
from album_lib import upload_album_json
from album_lib import invalidate_cloudfront


def arg_parsing():
    """Parses the arguments given to the script and returns them."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--album-id", help="ID of the new album", required=True)
    parser.add_argument("--bucket-name", help="Name of AWS S3 bucket the album will be uploaded to", required=True)
    parser.add_argument("--cloudfront-id", help="ID of the CloudFront distribution pointing to the S3 bucket.\n"
                                                "If set, the pictures in the JSON will be fetched from the "
                                                "distribution's Domain Name")
    parser.add_argument("--fullsize-ratio", type=float, help="If set, the ratio at which the fullsize pictures are "
                                                             "reduced. For example, 0.3 will reduce a 24MP picture "
                                                             "30 percent into a ~8MP picture.")

    return parser.parse_args()


def main():
    args = arg_parsing()

    s3, s3_client = init_bucket(args)

    base_url = f'https://{args.bucket_name}.s3.amazonaws.com/{args.album_id}'
    if args.cloudfront_id:
        cloudfront, distribution_id, base_url = init_cloudfront(args.cloudfront_id, {args.album_id})

    content = s3.Object(args.bucket_name, f'{args.album_id}/album.json')
    album_json = json.loads(content.get()['Body'].read().decode('utf-8'))
    pictures = list(map(lambda pic: pic['fullsize']['url'], album_json['pictures']))
    pictures = list(map(lambda url: re.search('([A-Z0-9_]+.jpg)', url).group(1), pictures))

    album_json['pictures'] = []
    counter = 1

    for picture in sorted(pictures):
        print(f'\nWorking on image {counter} out of {len(pictures)}')
        img = fetch_picture_s3(args.bucket_name, f'{args.album_id}/{picture}', s3_client)
        picture_name, file_ext = get_picture_file_name_and_ext(picture)
        album_json['pictures'].append(resize_and_upload(args.album_id, picture_name, args, base_url, counter, img,
                                                        s3_client, get_sizes()))
        counter += 1

    print("\nUploading the album's JSON file to S3")
    upload_album_json(album_json, args.album_id, args.bucket_name, s3)
    if args.cloudfront_id:
        print(f'\nInvalidating Cloudfront distribution {distribution_id}')
        invalidate_cloudfront(cloudfront, distribution_id, args.album_id)


main()
