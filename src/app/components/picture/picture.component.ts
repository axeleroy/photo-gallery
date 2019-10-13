import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import Picture from '../../types/Picture';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  @Input()
  private picture: Picture;

  @Output()
  private onClick: EventEmitter<Picture> = new EventEmitter<Picture>();

  constructor() { }

  ngOnInit() {
  }

}
