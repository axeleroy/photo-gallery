import Dexie from 'dexie';
import AlbumContent from '../types/AlbumContent';
import Album from '../types/Album';

export class AppDatabase extends Dexie {
  albums: Dexie.Table<CachedAlbum, string>;
  list: Dexie.Table<CachedAlbumList, string>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      albums: '&id',
      list: '&id'
    });

    // Data structure has changed for thumbnails, no way to patch things up: better clear everything and re-download.
    this.version(2).stores({
      albums: '&id',
      list: '&id'
    }).upgrade((tx) => {
      return tx.table('albums').clear()
    }).upgrade((tx) => {
      return tx.table('list').clear()
    });
  }
}

export class CachedContent<T> {
  id: string;
  content: T;
  fetchDate: Date;
}

export class CachedAlbum extends CachedContent<AlbumContent> {
}

export class CachedAlbumList extends CachedContent<Album[]> {
}

export const db = new AppDatabase();
