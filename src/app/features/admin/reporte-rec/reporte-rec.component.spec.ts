import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRecComponent } from './reporte-rec.component';

describe('ReporteRecComponent', () => {
  let component: ReporteRecComponent;
  let fixture: ComponentFixture<ReporteRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
