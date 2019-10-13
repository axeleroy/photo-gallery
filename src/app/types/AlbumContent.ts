import Album from "./Album";
import Picture from "./Picture";

export default interface AlbumContent extends Album {
    pictures: Picture[];
}