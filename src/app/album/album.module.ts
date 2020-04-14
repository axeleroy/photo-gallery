import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { AlbumPageComponent } from "./album-page/album-page.component";
import { PictureThumbnailComponent } from "./album-page/picture-thumbnail/picture-thumbnail.component";
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    AlbumPageComponent,
    PictureThumbnailComponent
  ],
  imports: [
    AlbumRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AlbumModule {
}
