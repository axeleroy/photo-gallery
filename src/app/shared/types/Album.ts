import { Thumbnail } from "./Thumbnail";

export default interface Album {
  id: string;
  name: string;
  thumbnail?: Thumbnail;
}
