import {Component, Input} from '@angular/core';
import Picture from '../../../types/Picture';

@Component({
  selector: 'app-picture',
  templateUrl: './picture-thumbnail.component.html',
  styleUrls: ['./picture-thumbnail.component.css']
})
export class PictureThumbnailComponent {

  @Input()
  picture: Picture;

}
