import { TestBed } from '@angular/core/testing';

import { ConfigInitService } from './config-init.service';

describe('ConfigInitService', () => {
  let service: ConfigInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
