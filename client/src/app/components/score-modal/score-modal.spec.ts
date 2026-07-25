import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreModal } from './score-modal';
import { TeamEnum } from '@app/interfaces/team';

describe('ScoreModal', () => {
  let component: ScoreModal;
  let fixture: ComponentFixture<ScoreModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should render the selected duo details', () => {
    component.duo = {
      id: '1',
      totalScore: 0,
      teamColor: TeamEnum.BLUE,
      adjustScore: 0,
      player1: { id: 'p1', name: 'Alice', teamId: 't1', driveTaken: 0, drivePar3Taken: 0 },
      player2: { id: 'p2', name: 'Bob', teamId: 't1', driveTaken: 0, drivePar3Taken: 0 },
      lastHole: { holeNumber: 9, isPar3: false, hitInFairway: false, hasHitInHazard: false, nbrOfPutt: 0, score: 0 },
      stats: [],
    } as any;

    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Alice');
    expect(content).toContain('Bob');
    expect(content).toContain('E');
  });
});
