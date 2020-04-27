import { ImageSet } from "./ImageSet";

export default interface Album {
  id: string;
  name: string;
  thumbnail?: ImageSet;
}
