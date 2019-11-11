import {Component, OnInit} from '@angular/core';
import AlbumContent from '../../types/AlbumContent';
import {ActivatedRoute} from '@angular/router';
import {Image} from "../../types/Image";
import Picture from "../../types/Picture";

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
  /**
   * Album to display.
   */
  private album: AlbumContent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.album = this.route.snapshot.data.album;
  }

  /**
   * Extract the thumbnail of a Picture.
   */
  getThumbnail(picture: Picture): Image {
    return picture.thumbnail;
  }
}
