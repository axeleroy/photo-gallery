import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumListPageComponent } from './album-list-page.component';

describe('AlbumListPageComponent', () => {
  let component: AlbumListPageComponent;
  let fixture: ComponentFixture<AlbumListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
