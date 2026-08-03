import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TeamEnum } from '@app/interfaces/team';
import { FoursomeService } from '@app/services/foursome.service';
import { ScoreEntryComponent } from './score-entry-component';

describe('ScoreEntryComponent', () => {
  let component: ScoreEntryComponent;
  let fixture: ComponentFixture<ScoreEntryComponent>;

  const mockFoursomes = [
    {
      id: 1,
      whitePlayers: [
        { id: 'p1', name: 'Alice', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
        { id: 'p2', name: 'Bob', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
      ],
      bluePlayers: [
        { id: 'p3', name: 'Charlie', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
        { id: 'p4', name: 'Diana', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
      ],
      whiteScore: 0,
      blueScore: 0,
      whiteHandicap: 0,
      blueHandicap: 0,
      whiteStats: [{ holeNumber: 1, isPar3: false, driveTakenBy: '', hasHitInFairway: false, hasHitInHazard: false, nbrOfPutt: 0, score: 0 }],
      blueStats: [],
    },
  ];

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [ScoreEntryComponent],
      providers: [{
        provide: FoursomeService,
        useValue: {
          getFoursomeByDay: () => of(mockFoursomes),
        },
      }],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreEntryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create and load day-specific duos', () => {
    expect(component).toBeTruthy();
    expect(component.selectedDay).toBe(1);
    expect(component.duoList.length).toBe(2);
    expect(component.selectedTeamId).toBe('1');
  });

  it('should persist the selected day and update the score for the active hole', () => {
    component.selectDay(2);
    expect(component.selectedDay).toBe(2);
    expect(localStorage.getItem('golf-board-selected-day')).toBe('2');

    component.duoList = [
      {
        id: 'duo-1',
        player1: { id: 'p1', name: 'Alice', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
        player2: { id: 'p2', name: 'Bob', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
        teamColor: TeamEnum.WHITE,
        totalScore: 0,
        adjustScore: 0,
        handicap: 0,
        lastHole: { holeNumber: 1, isPar3: false, driveTakenBy: '', hasHitInFairway: false, hasHitInHazard: false, nbrOfPutt: 0, score: 0 },
        stats: [{ holeNumber: 1, isPar3: false, driveTakenBy: '', hasHitInFairway: false, hasHitInHazard: false, nbrOfPutt: 0, score: 0 }],
      },
    ];
    component.selectedTeamId = 'duo-1';
    component.selectedHoleNum = 1;

    component.incrementScore();

    expect(component.currentScore).toBe(1);
    expect(component.frontNineTotal).toBe(1);
  });
});
