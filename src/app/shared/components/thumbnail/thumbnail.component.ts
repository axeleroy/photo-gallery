import { Component, Input } from '@angular/core';
import { ALL_MIME_TYPES, MimeType, Thumbnail } from "../../types/Thumbnail";
import { Image } from "../../types/Image";

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: [ './thumbnail.component.css' ]
})
export class ThumbnailComponent {
  @Input()
  thumbnail: Thumbnail;

  @Input()
  legend?: string;

  ALL_MIME_TYPES = ALL_MIME_TYPES;

  hasMimeType(mimeType: MimeType): boolean {
    return this.thumbnail.sizes[mimeType].length !== 0;
  }

  getSrcSet(mimeType: MimeType): string {
    let sizes = this.thumbnail.sizes[mimeType]
      .map((image: Image) => `${image.url} ${image.width}w`);
    return sizes.toString();
  }

}
