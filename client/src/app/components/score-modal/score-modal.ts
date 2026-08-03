import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { PlayerDuo } from '@app/interfaces/player';
import { TeamEnum } from '@app/interfaces/team';
import { HoleStats } from '@app/interfaces/hole-stats';
import { FIELD_INFO_2026 } from '@app/constants/terrain-golf-info-2026';

@Component({
  selector: 'app-score-modal',
  standalone: true,
  imports: [NgClass],
  templateUrl: './score-modal.html',
  styleUrl: './score-modal.scss',
})
export class ScoreModal {
  @Input() duo: PlayerDuo | null = null;
  @Input() day: number = 1;
  @Output() closed = new EventEmitter<void>();
  readonly TeamEnum = TeamEnum;

  closeModal(): void {
    this.closed.emit();
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

  getHolePar(holeNum: number): number {
    const day = this.day == 2 ? 2 : 1; 
    return FIELD_INFO_2026[day][holeNum-1].par;
  }

  getHoleByNumber(holeNum: number): HoleStats | undefined {
    return this.duo?.stats.find((h) => h.holeNumber === holeNum);
  }

  getScoreCellClass(holeNum: number, hole: HoleStats | undefined): string {
    if (!hole || hole.score === undefined || hole.score === null) return '';
    const par = this.getHolePar(holeNum);
    if (hole.score < par) return 'cell-birdie';
    if (hole.score > par) return 'cell-bogey';
    return '';
  }

  getHalfTotalPar(holes: number[]): number {
    return holes.reduce((acc, hNum) => {
      const hole = this.getHoleByNumber(hNum);
      return acc + this.getHolePar(hNum);
    }, 0);
  }

  getHalfTotalScore(holes: number[]): number {
    return holes.reduce((acc, hNum) => {
      const hole = this.getHoleByNumber(hNum);
      return acc + (hole?.score || 0);
    }, 0);
  }

  getGrossTotalScore(): number {
    if (!this.duo) return 0;
    return this.duo.stats.reduce((acc, h) => acc + (h.score || 0), 0) + this.duo.handicap;
  }
}
