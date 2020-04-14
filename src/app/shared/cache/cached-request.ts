import Dexie from 'dexie';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { CachedContent } from './app-database';
import { map, switchMap } from 'rxjs/operators';

/**
 * HTTP Client that caches responses to an IndexedDB during the given amount of days.
 */
export class CachedRequest<T> {
  private dateLimit = new Date();

  constructor(private http: HttpClient) {
  }

  /**
   * Fetches content from either a cache or the internet.
   *
   * @param table: Dexie table where the content is stored.
   * @param id: ID of the content to fetch and/or cache.
   * @param url: URL to request if the content is not in the cache or expired.
   * @param maxDays: number of days before the content is considered expired.
   */
  fetch(table: Dexie.Table<CachedContent<T>, string>, id: string, url: string, maxDays: number): Observable<T> {
    this.dateLimit.setDate(this.dateLimit.getDate() - maxDays);

    let obs: Observable<CachedContent<T>>;
    try {
      obs = from(table.get(id));
    } catch (e) {
      console.log('Fetch from Dexie failed, cause:', e);
      obs = of(null);
    }

    return obs.pipe(
      switchMap((cached: CachedContent<T>) => {
        // If the DB returns the cached element and is not too old, return it
        if (cached && cached.fetchDate > this.dateLimit) {
          return of(cached);
        } else {
          // Else, make a request
          return this.http.get<T>(url);
        }
      }),
      map((content: CachedContent<T> | T) => {
        // If from db, return it, else it has just been fetched, so save it
        if ((content as CachedContent<T>).content) {
          return (content as CachedContent<T>).content;
        } else {
          try {
            table.add({
              id: id,
              content: (content as T),
              fetchDate: new Date()
            });
          } catch (e) {
            console.log('Could not save to Dexie, cause:', e);
          }

          return (content as T);
        }
      }));
  }
}
