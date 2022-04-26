import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsReportComponent } from './contracts-report.component';

describe('ContractsReportComponent', () => {
  let component: ContractsReportComponent;
  let fixture: ComponentFixture<ContractsReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
