import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ventanilla2Component } from './ventanilla2.component';

describe('Ventanilla2Component', () => {
  let component: Ventanilla2Component;
  let fixture: ComponentFixture<Ventanilla2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ventanilla2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ventanilla2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
