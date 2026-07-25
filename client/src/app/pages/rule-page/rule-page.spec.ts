import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulePage } from './rule-page';

describe('RulePage', () => {
  let component: RulePage;
  let fixture: ComponentFixture<RulePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulePage],
    }).compileComponents();

    fixture = TestBed.createComponent(RulePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
