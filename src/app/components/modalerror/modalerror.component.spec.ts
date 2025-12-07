import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalerrorComponent } from './modalerror.component';

describe('ModalerrorComponent', () => {
  let component: ModalerrorComponent;
  let fixture: ComponentFixture<ModalerrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalerrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalerrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
