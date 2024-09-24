import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterFrontComponent } from './center-front.component';

describe('CenterFrontComponent', () => {
  let component: CenterFrontComponent;
  let fixture: ComponentFixture<CenterFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CenterFrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CenterFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
