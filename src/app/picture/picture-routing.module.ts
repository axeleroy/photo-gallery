import { PicturePageComponent } from "./picture-page/picture-page.component";
import { PictureService } from "./picture.service";
import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

const routes: Routes = [ {
  path: ':pictureId',
  component: PicturePageComponent,
  resolve: {
    picture: PictureService
  }
} ];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PictureRoutingModule {
}
