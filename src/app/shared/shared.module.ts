import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailComponent } from "./components/thumbnail/thumbnail.component";
import { ThumbnailListComponent } from "./components/thumbnail-list/thumbnail-list.component";


@NgModule({
  declarations: [
    ThumbnailComponent,
    ThumbnailListComponent
  ],
  exports: [
    ThumbnailComponent,
    ThumbnailListComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {
}
