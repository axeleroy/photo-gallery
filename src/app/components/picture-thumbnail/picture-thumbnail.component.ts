import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Picture from '../../types/Picture';

@Component({
  selector: 'app-picture',
  templateUrl: './picture-thumbnail.component.html',
  styleUrls: ['./picture-thumbnail.component.css']
})
export class PictureThumbnailComponent implements OnInit {

  @Input()
  private picture: Picture;

  constructor() { }

  ngOnInit() {
  }

}
