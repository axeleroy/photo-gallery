import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ImageSet } from "../../types/ImageSet";
import { ALL_MIME_TYPES, MimeType } from "../../types/MimeType";
import { Image } from "../../types/Image";

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent {
  @Input() picture: ImageSet;
  @Input() classes: string | string[] | Set<string> | {[p: string]: any};
  @Input() sizes: string;
  @Input() alt: string;
  @Input() placeholder = false;
  @Input() lazyload = true;

  @Output() loaded = new EventEmitter<void>();

  ALL_MIME_TYPES = ALL_MIME_TYPES;

  hasMimeType(mimeType: MimeType): boolean {
    return this.picture.sizes[mimeType].length !== 0;
  }

  getSrcSet(mimeType: MimeType): string {
    let sizes = this.picture.sizes[mimeType]
      .map((image: Image) => `${image.url} ${image.width}w`);
    return sizes.toString();
  }
}
