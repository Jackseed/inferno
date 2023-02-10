import { TestBed } from '@angular/core/testing';

import { ControllerInputService } from './controller-input.service';

describe('ControllerInputService', () => {
  let service: ControllerInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControllerInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
