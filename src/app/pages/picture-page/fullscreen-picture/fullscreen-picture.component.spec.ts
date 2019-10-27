import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenPictureComponent } from './fullscreen-picture.component';

describe('FullscreenPictureComponent', () => {
  let component: FullscreenPictureComponent;
  let fixture: ComponentFixture<FullscreenPictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullscreenPictureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
