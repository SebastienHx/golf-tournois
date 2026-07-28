import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlayerSection } from './new-player-section';

describe('NewPlayerSection', () => {
  let component: NewPlayerSection;
  let fixture: ComponentFixture<NewPlayerSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlayerSection],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPlayerSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
