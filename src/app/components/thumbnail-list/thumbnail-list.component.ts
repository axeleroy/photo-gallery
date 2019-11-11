import {Component, ContentChild, Input, OnInit, TemplateRef} from '@angular/core';
import { Image } from '../../types/Image'

@Component({
  selector: 'app-thumbnail-list',
  templateUrl: './thumbnail-list.component.html',
  styleUrls: ['./thumbnail-list.component.css']
})
export class ThumbnailListComponent implements OnInit {
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
  @ContentChild('thumbnail', { static: false }) thumbnailTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit() {
  }

  flexGrow(input: any) {
    const image: Image = this.imageFn(input);
    return image.width * 100 / image.height;
  }

}
