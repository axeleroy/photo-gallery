import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import AlbumContent from '../../types/AlbumContent';
import {catchError, map} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import Album from '../../types/Album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService implements Resolve<Album> {

  constructor(private http: HttpClient,
              private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Album> | Promise<Album> | Album {
    const albumId = route.paramMap.get('albumId');
    return this.http.get(environment.albumBaseUrl + albumId + environment.albumFileNameUrl)
    .pipe(
      catchError(() => this.router.navigateByUrl('/not-found')),
      map((data) => data as AlbumContent)
    );
  }

}
