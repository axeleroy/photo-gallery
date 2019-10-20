import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PictureWrapper} from "../../types/PictureWrapper";

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.css']
})
export class PicturePageComponent implements OnInit {
  private picture: PictureWrapper;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.picture = this.route.snapshot.data.picture;
    console.log(this.picture);
  }

}
