import { TestBed } from '@angular/core/testing';

import { OrdenatencionService } from './ordenatencion.service';

describe('OrdenatencionService', () => {
  let service: OrdenatencionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenatencionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
