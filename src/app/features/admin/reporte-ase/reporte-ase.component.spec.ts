import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAseComponent } from './reporte-ase.component';

describe('ReporteAseComponent', () => {
  let component: ReporteAseComponent;
  let fixture: ComponentFixture<ReporteAseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteAseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteAseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
