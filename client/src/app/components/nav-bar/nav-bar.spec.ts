import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavBar } from './nav-bar';

describe('NavBar', () => {
  let component: NavBar;
  let fixture: ComponentFixture<NavBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBar, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(NavBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render links to the main pages', () => {
    const links = fixture.nativeElement.querySelectorAll('a');
    const labels = Array.from(links).map((link: HTMLAnchorElement) => link.textContent?.trim());

    expect(labels).toContain('Board');
    expect(labels).toContain('Score');
    expect(labels).toContain('Rules');
    expect(labels).toContain('Admin');
  });
});
