import {Component, OnDestroy, OnInit} from '@angular/core';
import Album from '../../types/Album';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-album-list-page',
  templateUrl: './album-list-page.component.html',
  styleUrls: ['./album-list-page.component.css']
})
export class AlbumListPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private albums: Album[];

  constructor(private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.subscription = this.http.get(environment.albumListUrl)
      .subscribe((albumList: Album[]) => this.albums = albumList);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  navigateTo(album: Album) {
    this.router.navigate([ 'album', album.id ]);
  }

}
