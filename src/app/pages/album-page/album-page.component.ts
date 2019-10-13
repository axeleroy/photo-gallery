import {Component, OnInit} from '@angular/core';
import AlbumContent from '../../types/AlbumContent';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent implements OnInit {
  private album: AlbumContent;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.album = this.route.snapshot.data.album;
  }
}
