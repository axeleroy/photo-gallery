import Picture from "./Picture";

export interface PictureWrapper {
  picture: Picture;
  previousPictureId: string;
  nextPictureId: string;
}
