import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';
import { NgClass } from '@angular/common';
import { ScoreModal } from '../score-modal/score-modal';
import { FIELD_INFO_2026, PAR_INFO_2026 } from '@app/constants/terrain-golf-info-2026';

@Component({
    selector: 'app-leaderboard',
    standalone: true,
    imports: [NgClass, ScoreModal],
    templateUrl: './leaderboard.html',
    styleUrls: ['./leaderboard.scss']
})
export class Leaderboard implements OnInit, OnChanges {
    @Input() duos: PlayerDuo[] = [];
    @Input() day: number = 1;
    readonly TeamEnum = TeamEnum;

    isModalOpen = false;
    selectedDuo: PlayerDuo | null = null;

    ngOnInit(): void {
      this.updateSortedDuos();
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['duos']) {
        this.updateSortedDuos();
      }
    }

    private updateSortedDuos(): void {
      this.duos = [...(this.duos || [])].sort((a, b) => a.totalScore - b.totalScore);
    }

    openDetails(duo: PlayerDuo): void {
        this.selectedDuo = duo;
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.selectedDuo = null;
    }

    formatScore(score: number): string {
        const day = this.day == 2 ? 2 : 1; 
        const adjustScore = score - (PAR_INFO_2026[day]);

        if (adjustScore > 0) return `+${score}`;
        if (adjustScore === 0) return 'E';
        return `${score}`;
    }

    getScoreClass(score: number): string {
        const day = this.day == 2 ? 2 : 1; 
        const adjustScore = score - (PAR_INFO_2026[day]);

        if (adjustScore < 0) return 'score-under';
        if (adjustScore > 0) return 'score-over';
        return 'score-even';
    }
}