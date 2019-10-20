import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicturePageComponent } from './picture-page.component';

describe('PicturePageComponent', () => {
  let component: PicturePageComponent;
  let fixture: ComponentFixture<PicturePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicturePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicturePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
