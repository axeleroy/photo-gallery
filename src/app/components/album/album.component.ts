import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Album from '../../types/Album';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  @Input()
  private album: Album;

  constructor() { }

  ngOnInit() {
  }

}
