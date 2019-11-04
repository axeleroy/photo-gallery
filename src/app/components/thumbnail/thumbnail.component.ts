import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Image } from '../../types/Image';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  @Input()
  private image: Image;

  @Input()
  private legend?: string;

  constructor() { }

  ngOnInit() {
  }

}
