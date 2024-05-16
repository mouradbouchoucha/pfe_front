import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTraineeComponent } from './new-trainee.component';

describe('NewTraineeComponent', () => {
  let component: NewTraineeComponent;
  let fixture: ComponentFixture<NewTraineeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTraineeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewTraineeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
