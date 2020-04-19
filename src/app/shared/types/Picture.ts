import { Image } from './Image';
import { Thumbnail } from "./Thumbnail";

export default interface Picture {
  id: string;
  thumbnail: Thumbnail;
  fullsize: Image;
}
