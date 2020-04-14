import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumService } from "./album.service";
import { AlbumPageComponent } from "./album-page/album-page.component";


const routes: Routes = [ {
  path: ':albumId',
  resolve: {
    album: AlbumService
  },
  children: [
    {
      path: '',
      component: AlbumPageComponent
    },
    {
      path: 'picture',
      loadChildren: () => import('../picture/picture.module').then(m => m.PictureModule)
    }
  ]
} ];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AlbumRoutingModule {
}
