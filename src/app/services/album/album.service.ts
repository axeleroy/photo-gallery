import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import AlbumContent from '../../types/AlbumContent';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {db} from '../../cache/app-database';
import {CachedRequest} from '../../cache/cached-request';

@Injectable({
  providedIn: 'root'
})
export class AlbumService implements Resolve<AlbumContent> {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AlbumContent> {
    const albumId = route.paramMap.get('albumId');
    return new CachedRequest<AlbumContent>(this.http)
    .fetch(db.albums, albumId, environment.albumBaseUrl + albumId + environment.albumFileNameUrl, environment.albumCacheDuration)
    .pipe(
      catchError(() => {
        this.router.navigateByUrl('/not-found');
        return of(null);
      })
    );
  }

}
