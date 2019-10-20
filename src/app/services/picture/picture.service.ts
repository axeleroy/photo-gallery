import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {PictureWrapper} from "../../types/PictureWrapper";

@Injectable({
  providedIn: 'root'
})
export class PictureService implements Resolve<PictureWrapper> {

  constructor(private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PictureWrapper {
    const album = route.parent.data.album;

    const pictureId = route.paramMap.get('pictureId');
    const pictureIndex = album.pictures.findIndex((value) => value.id === pictureId);

    if (pictureIndex < 0) { // pictureId not found
      this.router.navigateByUrl('/not-found');
    }

    return {
      picture: album.pictures[pictureIndex],
      nextPictureId: (pictureIndex + 1 > album.pictures.length) ? null : album.pictures[pictureIndex + 1].id,
      previousPictureId: (pictureIndex == 0) ? null : album.pictures[pictureIndex - 1].id
    };
  }
}
