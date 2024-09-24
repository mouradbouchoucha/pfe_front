import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreInscriptionListComponent } from './pre-inscription-list.component';

describe('PreInscriptionListComponent', () => {
  let component: PreInscriptionListComponent;
  let fixture: ComponentFixture<PreInscriptionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreInscriptionListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreInscriptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
