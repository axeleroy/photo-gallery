import { Component, ElementRef, Input } from '@angular/core';
// @ts-ignore
import EXIF from 'exif-js';
import { EXIFNumber } from "../../../shared/types/EXIFNumber";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: [ './info-panel.component.css' ]
})
export class InfoPanelComponent {
  exifTags: any;
  _pictureElement: ElementRef;

  @Input()
  set pictureElement(value: ElementRef) {
    this._pictureElement = value;
    this.updateExif();
  }

  @Input() loading = true;

  updateExif() {
    if (this._pictureElement.nativeElement) {
      const img = this._pictureElement.nativeElement;
      // exif-js stores a cached version of the EXIF in the element,
      // so we have to delete it in order to extract EXIF on image change.
      img.exifdata = null;

      // Self reference for callback function.
      const self = this;
      EXIF.getData(img, function () {
        self.exifTags = EXIF.getAllTags(this);
      });
    }
  }

  numberToString(number: EXIFNumber, fraction?: boolean): string {
    if (fraction && number.valueOf() < 1) {
      return '1/' + Math.trunc(number.denominator / number.numerator);
    } else {
      return number.toString(10);
    }
  }


}
