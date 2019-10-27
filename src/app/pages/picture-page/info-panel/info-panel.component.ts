import {Component, ElementRef, Input, OnInit} from '@angular/core';
// @ts-ignore
import EXIF from 'exif-js';
import {EXIFNumber} from "../../../types/EXIFNumber";

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {
  exifTags: any;

  @Input()
  set pictureElement(value: ElementRef) {
    if (value.nativeElement) {
      const img = value.nativeElement;
      // exif-js stores a cached version of the EXIF in the element,
      // so we have to delete it in order to extract EXIF on image change.
      img.exifdata = null;

      // Self reference for callback function.
      const self = this;
      EXIF.getData(img, function() {
        self.exifTags  = EXIF.getAllTags(this);
        console.log(self.exifTags);
      });
    }
  }

  constructor() { }

  ngOnInit() {
  }

  numberToString(number: EXIFNumber, fraction?: boolean): string {
    if (fraction) {
      return number.numerator + '/' + number.denominator;
    } else {
      return number.toString(10);
    }
  }



}
