import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailComponent } from "./components/thumbnail/thumbnail.component";
import { ThumbnailListComponent } from "./components/thumbnail-list/thumbnail-list.component";
import { PictureComponent } from './components/picture/picture.component';


@NgModule({
  declarations: [
    ThumbnailComponent,
    ThumbnailListComponent,
    PictureComponent
  ],
  exports: [
    ThumbnailComponent,
    ThumbnailListComponent,
    PictureComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
}
