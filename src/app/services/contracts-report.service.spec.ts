import { TestBed } from '@angular/core/testing';

import { ContractsReportService } from './contracts-report.service';

describe('ContractsReportService', () => {
  let service: ContractsReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractsReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
