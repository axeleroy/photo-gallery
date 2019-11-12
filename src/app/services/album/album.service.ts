import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import AlbumContent from '../../types/AlbumContent';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import Album from '../../types/Album';
import {CachedAlbum, db} from '../../AppDatabase';

@Injectable({
  providedIn: 'root'
})
export class AlbumService implements Resolve<Album> {
  thirtyDaysAgo = new Date();

  constructor(private http: HttpClient,
              private router: Router) {
    this.thirtyDaysAgo.setDate(this.thirtyDaysAgo.getDate() - 30);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Album> {
    const albumId = route.paramMap.get('albumId');
    return from(db.albums.get(albumId))
        .pipe(
          switchMap((cachedAlbum: CachedAlbum) => {
            // If the DB returns the album and is not too old, return it
            if (cachedAlbum && cachedAlbum.fetchDate > this.thirtyDaysAgo) {
              return of(cachedAlbum);
            } else {
              // Else, fetch the album
              return this.http.get<AlbumContent>(environment.albumBaseUrl + albumId + environment.albumFileNameUrl);
            }
          }),
          map((album: CachedAlbum | AlbumContent) => {
            // If from db, return it, else it has just been fetched, so save it
            if ((album as CachedAlbum).album) {
              return (album as CachedAlbum).album;
            } else {
              db.albums.add({
                id: album.id,
                album: (album as AlbumContent),
                fetchDate: new Date()
              });

              return album;
            }
          }),
          catchError(() => {
            this.router.navigateByUrl('/not-found');
            return of(null);
          })
        );
  }

}
