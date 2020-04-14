import { RouterModule, Routes } from "@angular/router";
import { AlbumListPageComponent } from "./album-list-page/album-list-page.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: '',
    component: AlbumListPageComponent
  },
  {
    path: 'album',
    loadChildren: () => import('../album/album.module').then(m => m.AlbumModule)
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AlbumListRoutingModule {
}
