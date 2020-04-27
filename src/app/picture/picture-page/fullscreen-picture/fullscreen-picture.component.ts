import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PictureWrapper } from '../../../shared/types/PictureWrapper';

@Component({
  selector: 'app-fullscreen-picture',
  templateUrl: './fullscreen-picture.component.html',
  styleUrls: [ './fullscreen-picture.component.css' ]
})
export class FullscreenPictureComponent {
  wrapper: PictureWrapper;
  loading = true;

  @Input()
  set picture(input: PictureWrapper) {
    this.loading = true;
    this.wrapper = input;
  }

  @ViewChild('pictureElement')
  public pictureElement: ElementRef;

  /**
   * Stop displaying the loader once the fullsize image has loaded.
   */
  onLoad() {
    console.log("loaded");
    this.loading = false;
  }

}
