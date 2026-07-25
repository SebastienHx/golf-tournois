import { Component, Input, OnInit } from '@angular/core';
import { PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';
import { NgClass } from '@angular/common';
import { ScoreModal } from '../score-modal/score-modal';

@Component({
    selector: 'app-leaderboard',
    standalone: true,
    imports: [NgClass, ScoreModal],
    templateUrl: './leaderboard.html',
    styleUrls: ['./leaderboard.scss']
})
export class Leaderboard implements OnInit {
    @Input() duos: PlayerDuo[] = [];
    readonly TeamEnum = TeamEnum;

    isModalOpen = false;
    selectedDuo: PlayerDuo | null = null;

    ngOnInit(): void {
        this.duos.sort((a, b) => a.totalScore - b.totalScore);
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
        if (score > 0) return `+${score}`;
        if (score === 0) return 'E';
        return `${score}`;
    }

    getScoreClass(score: number): string {
        if (score < 0) return 'score-under';
        if (score > 0) return 'score-over';
        return 'score-even';
    }
}