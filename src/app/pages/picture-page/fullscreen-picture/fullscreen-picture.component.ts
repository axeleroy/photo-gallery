import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PictureWrapper} from '../../../types/PictureWrapper';

@Component({
  selector: 'app-fullscreen-picture',
  templateUrl: './fullscreen-picture.component.html',
  styleUrls: ['./fullscreen-picture.component.css']
})
export class FullscreenPictureComponent implements OnInit {

  @Input()
  private wrapper: PictureWrapper;

  @ViewChild('pictureElement', { static: false })
  public pictureElement: ElementRef;

  constructor() { }

  ngOnInit() {
  }

}
