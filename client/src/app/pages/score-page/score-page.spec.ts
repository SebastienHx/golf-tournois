import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePage } from './score-page';

describe('ScorePage', () => {
  let component: ScorePage;
  let fixture: ComponentFixture<ScorePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ScorePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
