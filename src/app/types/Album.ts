import { Image } from './Image';

export default interface Album {
    id: string;
    name: string;
    thumbnail?: Image;
}
