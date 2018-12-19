import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersServiceComponent } from './customers-service.component';

describe('CustomersServiceComponent', () => {
  let component: CustomersServiceComponent;
  let fixture: ComponentFixture<CustomersServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
