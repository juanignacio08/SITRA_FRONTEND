import { TestBed } from '@angular/core/testing';

import { TablamaestraService } from './tablamaestra.service';

describe('TablamaestraService', () => {
  let service: TablamaestraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TablamaestraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
