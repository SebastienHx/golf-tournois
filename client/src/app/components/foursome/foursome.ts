import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';
import { ScoreModal } from '../score-modal/score-modal';

@Component({
    selector: 'app-foursome',
    standalone: true,
    imports: [NgClass, ScoreModal],
    templateUrl: './foursome.html',
    styleUrls: ['./foursome.scss']
})
export class FoursomeComponent {
    @Input() title: string = 'FOURSOME 1';
    @Input() duo1!: PlayerDuo;
    @Input() duo2!: PlayerDuo;

    readonly TeamEnum = TeamEnum;
    selectedDuo: PlayerDuo | null = null;
    isModalOpen = false;

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

    getGrossTotalScore(duo: PlayerDuo): number {
        if (!duo || !duo.stats) return 0;
        return duo.stats.reduce((acc, h) => acc + (h.score || 0), 0) + duo.handicap;
    }

    openDetails(duo: PlayerDuo): void {
        this.selectedDuo = duo;
        this.isModalOpen = true;
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.selectedDuo = null;
    }

    getMatchStatus(): string {
        if (!this.duo1 || !this.duo2) return '';

        const diff = this.duo2.totalScore - this.duo1.totalScore;

        if (diff > 0) {
            return `BLUE -${diff}`;
        } else if (diff < 0) {
            return `WHITE -${Math.abs(diff)}`;
        }
        return 'ALL SQUARE';
    }

    getMatchStatusClass(): string {
        if (!this.duo1 || !this.duo2) return '';
        const diff = this.duo2.totalScore - this.duo1.totalScore;
        if (diff > 0) return 'badge-blue';
        if (diff < 0) return 'badge-white';
        return 'badge-as';
    }
}