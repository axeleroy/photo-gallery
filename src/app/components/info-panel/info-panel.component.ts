import {Component, ElementRef, Input, OnInit} from '@angular/core';
import EXIF from 'exif-js';

@Component({
  selector: 'app-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.css']
})
export class InfoPanelComponent implements OnInit {
  exifTags: any;

  @Input()
  set pictureElement(value: ElementRef) {
    this.exifTags = EXIF.getAllTags(value);
  }

  constructor() { }

  ngOnInit() {
  }

}
