import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { AlbumComponent } from './components/album/album.component';
import { PictureComponent } from './components/picture/picture.component';
import { AlbumListPageComponent } from './pages/album-list-page/album-list-page.component';
import { AlbumPageComponent } from './pages/album-page/album-page.component';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import {PicturePageComponent} from "./pages/picture-page/picture-page.component";

@NgModule({
  declarations: [
    AppComponent,
    ThumbnailComponent,
    AlbumComponent,
    PictureComponent,
    AlbumListPageComponent,
    AlbumPageComponent,
    NotFoundPageComponent,
    PicturePageComponent
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
