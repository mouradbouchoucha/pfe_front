import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryMadalComponent } from './edit-category-madal.component';

describe('EditCategoryMadalComponent', () => {
  let component: EditCategoryMadalComponent;
  let fixture: ComponentFixture<EditCategoryMadalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCategoryMadalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCategoryMadalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
