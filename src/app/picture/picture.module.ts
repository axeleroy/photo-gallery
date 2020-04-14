import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "./loader-component/loader.component";
import { PicturePageComponent } from "./picture-page/picture-page.component";
import { SharedModule } from "../shared/shared.module";
import { FullscreenPictureComponent } from "./picture-page/fullscreen-picture/fullscreen-picture.component";
import { InfoPanelComponent } from "./picture-page/info-panel/info-panel.component";
import { PictureRoutingModule } from "./picture-routing.module";


@NgModule({
  declarations: [
    FullscreenPictureComponent,
    InfoPanelComponent,
    LoaderComponent,
    PicturePageComponent
  ],
  imports: [
    CommonModule,
    PictureRoutingModule,
    SharedModule
  ]
})
export class PictureModule {
}
