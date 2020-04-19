import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import AlbumContent from '../shared/types/AlbumContent';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService implements Resolve<AlbumContent> {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AlbumContent> {
    const albumId = route.paramMap.get('albumId');
    return this.http.get<AlbumContent>(environment.albumBaseUrl + albumId + environment.albumFileNameUrl)
      .pipe(
        catchError(() => {
          this.router.navigateByUrl('/not-found');
          return of(null);
        })
      );
  }

}
