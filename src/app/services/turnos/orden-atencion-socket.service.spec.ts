import { TestBed } from '@angular/core/testing';

import { OrdenAtencionSocketService } from './orden-atencion-socket.service';

describe('OrdenAtencionSocketService', () => {
  let service: OrdenAtencionSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrdenAtencionSocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
