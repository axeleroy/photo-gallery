import {Component, Input} from '@angular/core';
import {Image} from '../../types/Image';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent {
  @Input()
  image: Image;

  @Input()
  legend?: string;

}
