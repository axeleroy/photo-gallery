# PhotoGallery

## Todo

* Picture page
    * Find out why the EXIF is not always updated when going through the gallery 
    * Navigating between images and back to album using arrow keys and ESC
    * Zooming in image
* Styling / icons 
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
    
