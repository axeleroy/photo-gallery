import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumThumbnailComponent } from './album-thumbnail.component';

describe('AlbumComponent', () => {
  let component: AlbumThumbnailComponent;
  let fixture: ComponentFixture<AlbumThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumThumbnailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
