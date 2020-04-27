import { Component, OnInit } from '@angular/core';
import AlbumContent from '../../shared/types/AlbumContent';
import { ActivatedRoute } from '@angular/router';
import { Image } from "../../shared/types/Image";
import Picture from "../../shared/types/Picture";
import { ImageSet } from "../../shared/types/ImageSet";

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: [ './album-page.component.css' ]
})
export class AlbumPageComponent implements OnInit {
  /**
   * Album to display.
   */
  album: AlbumContent;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.album = this.route.snapshot.data.album;
  }

  /**
   * Extract the thumbnail of a Picture.
   */
  getThumbnail(picture: Picture): ImageSet {
    return picture.thumbnail;
  }
}
