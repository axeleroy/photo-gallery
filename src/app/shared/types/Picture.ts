import { ImageSet } from "./ImageSet";
import { ExifTag } from "./ExifTag";

export default interface Picture {
  id: string;
  thumbnail: ImageSet;
  fullsize: ImageSet;
  exif?: ExifMap;
}

export type ExifMap = {
  [exifTag in ExifTag]: string | number
}

