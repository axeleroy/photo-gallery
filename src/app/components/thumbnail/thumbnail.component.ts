import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  @Input()
  private thumbnailUrl: string;

  @Input()
  private legend?: string;

  constructor() { }

  ngOnInit() {
  }

}
