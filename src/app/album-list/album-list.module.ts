import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumListPageComponent } from "./album-list-page/album-list-page.component";
import { AlbumThumbnailComponent } from "./album-list-page/album-thumbnail/album-thumbnail.component";
import { SharedModule } from "../shared/shared.module";
import { AlbumListRoutingModule } from "./album-list-routing.module";



@NgModule({
  declarations: [
    AlbumListPageComponent,
    AlbumThumbnailComponent
  ],
  imports: [
    AlbumListRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AlbumListModule { }
