import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Player } from '@app/interfaces/player';
import { PlayerService } from '@app/services/player.service';
import { FoursomeDuoManagementPage } from './foursome-duo-management-page';

describe('FoursomeDuoManagementPage', () => {
  let component: FoursomeDuoManagementPage;
  let fixture: ComponentFixture<FoursomeDuoManagementPage>;

  const players: Player[] = [
    { id: 'p1', name: 'Alice', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
    { id: 'p2', name: 'Bob', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
    { id: 'p3', name: 'Charlie', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
    { id: 'p4', name: 'Diana', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
    { id: 'p5', name: 'Evan', duoIds: [], driveTaken: 0, drivePar3Taken: 0 },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoursomeDuoManagementPage],
      providers: [
        {
          provide: PlayerService,
          useValue: {
            getAllPlayers: () => of(players),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FoursomeDuoManagementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create a day-specific foursome with 2 white and 2 blue players', () => {
    component.selectDay(2);
    component.addPlayerToTeam('WHITE', 'p1');
    component.addPlayerToTeam('WHITE', 'p2');
    component.addPlayerToTeam('BLUE', 'p3');
    component.addPlayerToTeam('BLUE', 'p4');

    component.saveCurrentFoursome();

    expect(component.selectedDay()).toBe(2);
    expect(component.getFoursomesForSelectedDay().length).toBe(1);
    expect(component.getFoursomesForSelectedDay()[0].whitePlayers.map((player) => player.id)).toEqual(['p1', 'p2']);
    expect(component.getFoursomesForSelectedDay()[0].bluePlayers.map((player) => player.id)).toEqual(['p3', 'p4']);
  });
});
