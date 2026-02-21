import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCuidado } from './crear-cuidado';

describe('CrearCuidado', () => {
  let component: CrearCuidado;
  let fixture: ComponentFixture<CrearCuidado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearCuidado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCuidado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
