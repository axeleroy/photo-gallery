import { TestBed } from '@angular/core/testing';

import { PictureService } from './picture.service';

describe('PicutreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PictureService = TestBed.get(PictureService);
    expect(service).toBeTruthy();
  });
});
