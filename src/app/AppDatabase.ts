import Dexie from 'dexie';
import AlbumContent from './types/AlbumContent';

export class AppDatabase extends Dexie {
  albums: Dexie.Table<CachedAlbum, string>;

  constructor() {
    super('AppDatabase');

    this.version(1).stores({
      albums: '&id'
    });
  }
}

export class CachedAlbum {
  id: string;
  album: AlbumContent;
  fetchDate: Date;
}

export const db = new AppDatabase();
