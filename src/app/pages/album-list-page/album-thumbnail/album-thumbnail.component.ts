import {Component, Input, OnInit} from '@angular/core';
import Album from '../../../types/Album';

@Component({
  selector: 'app-album',
  templateUrl: './album-thumbnail.component.html',
  styleUrls: ['./album-thumbnail.component.css']
})
export class AlbumThumbnailComponent implements OnInit {

  @Input()
  album: Album;

  constructor() { }

  ngOnInit() {
  }

}
