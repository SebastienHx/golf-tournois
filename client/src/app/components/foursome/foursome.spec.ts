import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Foursome } from './foursome';

describe('Foursome', () => {
  let component: Foursome;
  let fixture: ComponentFixture<Foursome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Foursome],
    }).compileComponents();

    fixture = TestBed.createComponent(Foursome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
