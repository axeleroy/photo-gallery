import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { AlbumThumbnailComponent } from './components/album-thumbnail/album-thumbnail.component';
import { PictureThumbnailComponent } from './components/picture-thumbnail/picture-thumbnail.component';
import { AlbumListPageComponent } from './pages/album-list-page/album-list-page.component';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {PicturePageComponent} from "./pages/picture-page/picture-page.component";
import { FullscreenPictureComponent } from './components/fullscreen-picture/fullscreen-picture.component';
import { InfoPanelComponent } from './components/info-panel/info-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    ThumbnailComponent,
    AlbumThumbnailComponent,
    PictureThumbnailComponent,
    AlbumListPageComponent,
    AlbumPageComponent,
    NotFoundPageComponent,
    PicturePageComponent,
    FullscreenPictureComponent,
    InfoPanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
