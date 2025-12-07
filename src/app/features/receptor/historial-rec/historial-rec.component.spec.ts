import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialRecComponent } from './historial-rec.component';

describe('HistorialRecComponent', () => {
  let component: HistorialRecComponent;
  let fixture: ComponentFixture<HistorialRecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialRecComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
