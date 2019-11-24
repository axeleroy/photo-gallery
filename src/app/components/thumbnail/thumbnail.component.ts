import {Component, Input, OnInit} from '@angular/core';
import {Image} from '../../types/Image';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  @Input()
  image: Image;

  @Input()
  legend?: string;

  constructor() { }

  ngOnInit() {
  }

}
