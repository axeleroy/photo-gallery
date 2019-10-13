import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlbumListPageComponent} from './pages/album-list-page/album-list-page.component';
import {AlbumPageComponent} from './pages/album-page/album-page.component';
import {AlbumService} from './services/album.service';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {PicturePageComponent} from './pages/picture-page/picture-page.component';


const routes: Routes = [
  {
    path: '',
    component: AlbumListPageComponent
  },
  {
    path: 'album/:albumId',
    component: AlbumPageComponent,
    resolve: {
      album: AlbumService
    },
    children: [
      {
        path: 'picture/:pictureId',
        component: PicturePageComponent
      }
    ]
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
