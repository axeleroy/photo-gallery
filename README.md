# PhotoGallery

## Todo

* Styling / icons 
    * Next / Previous / Back / Info buttons in PicturePage
    * Icons in Info Panel
    * Google Photos styling for AlbumList / Album pages
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
