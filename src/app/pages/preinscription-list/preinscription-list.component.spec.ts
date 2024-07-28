import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreinscriptionListComponent } from './preinscription-list.component';

describe('PreinscriptionListComponent', () => {
  let component: PreinscriptionListComponent;
  let fixture: ComponentFixture<PreinscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreinscriptionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreinscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
