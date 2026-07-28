import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLockSection } from './admin-lock-section';

describe('AdminLockSection', () => {
  let component: AdminLockSection;
  let fixture: ComponentFixture<AdminLockSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLockSection],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLockSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
