import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientesRecComponent } from './pacientes-rec.component';

describe('PacientesRecComponent', () => {
  let component: PacientesRecComponent;
  let fixture: ComponentFixture<PacientesRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PacientesRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PacientesRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
