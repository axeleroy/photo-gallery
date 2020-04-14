import { Component, Input } from '@angular/core';
import Album from '../../../shared/types/Album';

@Component({
  selector: 'app-album',
  templateUrl: './album-thumbnail.component.html',
  styleUrls: [ './album-thumbnail.component.css' ]
})
export class AlbumThumbnailComponent {

  @Input()
  album: Album;

}
