import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoursomeManagerComponent } from './foursome-manager-component';

describe('FoursomeManagerComponent', () => {
  let component: FoursomeManagerComponent;
  let fixture: ComponentFixture<FoursomeManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoursomeManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FoursomeManagerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
