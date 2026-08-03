import { Component } from '@angular/core';
import { ScoreEntryComponent } from '@app/components/score-entry-component/score-entry-component';

@Component({
  selector: 'app-score-page',
  standalone: true,
  imports: [ScoreEntryComponent],
  templateUrl: './score-page.html',
  styleUrl: './score-page.scss',
})
export class ScorePage {}
