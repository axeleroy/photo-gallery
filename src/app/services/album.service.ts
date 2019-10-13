import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import AlbumContent from '../types/AlbumContent';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import Album from '../types/Album';

@Injectable({
  providedIn: 'root'
})
export class AlbumService implements Resolve<Album> {

  constructor(private http: HttpClient) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Album> | Promise<Album> | Album {
    const albumId = route.paramMap.get('albumId');

    return this.http.get(environment.albumBaseUrl + albumId + environment.albumFileNameUrl)
    .pipe(
      map((data) => data as AlbumContent)
    );
  }

}
