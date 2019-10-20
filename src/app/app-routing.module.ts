import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlbumListPageComponent} from './pages/album-list-page/album-list-page.component';
import {AlbumPageComponent} from './pages/album-page/album-page.component';
import {AlbumService} from './services/album/album.service';
import {NotFoundPageComponent} from './pages/not-found-page/not-found-page.component';
import {PicturePageComponent} from "./pages/picture-page/picture-page.component";
import {PictureService} from "./services/picture/picture.service";

const routes: Routes = [
  {
    path: '',
    component: AlbumListPageComponent
  },
  {
    path: 'album/:albumId',
    resolve: {
      album: AlbumService
    },
    children: [
      {
        path: '',
        component: AlbumPageComponent,
      },
      {
        path: 'picture/:pictureId',
        component: PicturePageComponent,
        resolve: {
          picture: PictureService
        }
      }
    ]
  },
  {
    path: 'not-found',
    component: NotFoundPageComponent
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
