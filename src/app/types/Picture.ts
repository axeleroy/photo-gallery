import {Image} from './Image';

export default interface Picture {
    id: string;
    thumbnail: Image;
    fullsize: Image;
}
