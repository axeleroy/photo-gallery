import { Image } from "./Image";
import { MimeType } from "./MimeType";

export interface ImageSet {
  default: Image;
  sizes: ImageSetMap;
}

export type ImageSetMap = {
  [mimeType in MimeType]: Image[];
};
