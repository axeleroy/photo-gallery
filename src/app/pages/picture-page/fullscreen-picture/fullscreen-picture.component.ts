import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PictureWrapper} from '../../../types/PictureWrapper';

@Component({
  selector: 'app-fullscreen-picture',
  templateUrl: './fullscreen-picture.component.html',
  styleUrls: ['./fullscreen-picture.component.css']
})
export class FullscreenPictureComponent implements OnInit {
  wrapper: PictureWrapper;
  loading = true;

  @Output() loadingStateChange = new EventEmitter<boolean>();

  @Input()
  set picture(input: PictureWrapper) {
    this.loading = true;
    this.loadingStateChange.emit(true)
    this.wrapper = input;
  }

  @ViewChild('pictureElement', { static: false })
  public pictureElement: ElementRef;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Stop displaying the thumbnail and loader once the fullsize image has loaded.
   */
  onLoad() {
    this.loading = false;
    this.loadingStateChange.emit(false);
  }

}
