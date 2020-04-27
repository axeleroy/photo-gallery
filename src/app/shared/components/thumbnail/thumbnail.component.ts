import { Component, Input } from '@angular/core';
import { ImageSet } from "../../types/ImageSet";

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: [ './thumbnail.component.css' ]
})
export class ThumbnailComponent {
  @Input()
  thumbnail: ImageSet;

  @Input()
  legend?: string;

}
