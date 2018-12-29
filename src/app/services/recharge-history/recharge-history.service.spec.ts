import { TestBed } from '@angular/core/testing';

import { RechargeHistoryService } from './recharge-history.service';

describe('RechargeHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RechargeHistoryService = TestBed.get(RechargeHistoryService);
    expect(service).toBeTruthy();
  });
});
