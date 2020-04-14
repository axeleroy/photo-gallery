import {Component, ContentChild, Input, TemplateRef} from '@angular/core';
import {Image} from '../../types/Image'

@Component({
  selector: 'app-thumbnail-list',
  templateUrl: './thumbnail-list.component.html',
  styleUrls: ['./thumbnail-list.component.css']
})
export class ThumbnailListComponent {
  /**
   * List of Album or Picture to display.
   */
  @Input() list: any;

  /**
   * Function to extract the Image from an Album or Picture.
   */
  @Input() imageFn: (x: any) => Image = ((x: any) => x);

  /**
   * Component to display.
   */
  @ContentChild('thumbnail') thumbnailTemplate: TemplateRef<any>;

  ratio(input: any) {
    const image: Image = this.imageFn(input);
    return 240 / (image.height / image.width);
  }

}
