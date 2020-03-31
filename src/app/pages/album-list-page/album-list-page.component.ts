import {Component, OnDestroy, OnInit} from '@angular/core';
import Album from '../../types/Album';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Subscription} from 'rxjs';
import {Image} from '../../types/Image';
import {CachedRequest} from '../../cache/cached-request';
import {db} from '../../cache/app-database';

@Component({
  selector: 'app-album-list-page',
  templateUrl: './album-list-page.component.html',
  styleUrls: ['./album-list-page.component.css']
})
export class AlbumListPageComponent implements OnInit, OnDestroy {
  /**
   * Subscription to the Albums observable.
   */
  private subscription: Subscription;

  /**
   * List of album to display.
   */
  albums: Album[];
  environment = environment;

  constructor(private router: Router,
              private http: HttpClient) { }

  ngOnInit() {
    this.subscription = new CachedRequest<Album[]>(this.http)
      .fetch(db.list, 'list', environment.albumListUrl, environment.albumListCacheDuration)
      .subscribe((albumList: Album[]) => this.albums = albumList);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Extracts the thumbnail of an Album.
   */
  getThumbnail(album: Album): Image {
    return album.thumbnail;
  }
}
