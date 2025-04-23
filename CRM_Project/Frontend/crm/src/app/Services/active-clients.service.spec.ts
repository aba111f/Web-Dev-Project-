import { TestBed } from '@angular/core/testing';

import { ActiveClientsService } from './active-clients.service';

describe('ActiveClientsService', () => {
  let service: ActiveClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
