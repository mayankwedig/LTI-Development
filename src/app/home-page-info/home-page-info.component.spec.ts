import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageInfoComponent } from './home-page-info.component';

describe('HomePageInfoComponent', () => {
  let component: HomePageInfoComponent;
  let fixture: ComponentFixture<HomePageInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
