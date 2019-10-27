import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Album from '../../../types/Album';

@Component({
  selector: 'app-album',
  templateUrl: './album-thumbnail.component.html',
  styleUrls: ['./album-thumbnail.component.css']
})
export class AlbumThumbnailComponent implements OnInit {

  @Input()
  private album: Album;

  constructor() { }

  ngOnInit() {
  }

}
