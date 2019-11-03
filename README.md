# PhotoGallery

## Todo

* Styling / icons 
    * Google Photos styling for AlbumList / Album pages
    * Mobile view
* Script for generating albums
    * Inputs:
        * Path to pictures folder
        * Path to `albums.json`
        * Name of the album
        * ID of the album
        * Bucket name
    * Uploads to `s3://bucket-name/album-id/` :
        * Thumbnails created by the script using imagemagick
        * Pictures in the folder
        * AlbumContent JSON
    * Output:
        * Updated `albums.json`
* Bonus:
    * Zooming in image
