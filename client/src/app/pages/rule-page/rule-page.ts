import { Component } from '@angular/core';

export interface RuleSection {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  content: string[];
}

@Component({
  selector: 'app-rule-page',
  imports: [],
  templateUrl: './rule-page.html',
  styleUrl: './rule-page.scss',
})
export class RulePage {

rules: RuleSection[] = [
    {
      id: 'format',
      title: '1. Format du tournoi',
      icon: '⛳',
      isOpen: true, // Default open first section
      content: [
        'Le tournoi se déroule sur 2 jours, avec un changement de foursome à la fin de la première journée.',
        'Les équipes sont les BLANCS ⚪ vs les BLEUS 🔵.',
        'Chaque foursome contient un duo de chaque équipe.',
        'Les scores sont enregistrés et se mettent à jour en direct sur cette application.'
      ]
    },
    {
      id: 'drives',
      title: '2. Requis d\'un Minimum de Drive',
      icon: '🏌️‍♂️',
      isOpen: false,
      content: [
        'Chaque joueur de l\'équipe doit contribuer un nombre minimum de coups de départ (drives) sur l\'ensemble des 18 trous.',
        'Un minimum *4 drives* par joueur sur des trous Par 4 ou plus doivent être sélectionnés avant la fin de la journée.',
        'Les drives des trous Par 3 sont comptabilisés séparément.'
      ]
    },
    {
      id: 'scoring',
      title: '3. Pointage & Suivi des stats',
      icon: '📊',
      isOpen: false,
      content: [
        'Le poitange de chaque duo est affiché sur le leaderboard principal.',
        'Les joueurs doivent enregistrer leurs statistiques pour chaque trou : score total, nombre de putts, de coups sur le fairway et de pénalités pour obstacles.',
        'Sur votre carte de score numérique, les birdies (sous le par) sont surlignés en vert, tandis que les bogeys (au-dessus du par) sont surlignés en rouge.'
      ]
    },
    {
      id: 'handicap',
      title: '4. Handicapes & Ajustements',
      icon: '⚖️',
      isOpen: false,
      content: [
        'Les handicaps sont appliqués automatiquement.',
        'En cas d\'égalité à la fin des 18 trous, le vainqueur sera désigné par un décompte des 9 derniers trous.'
      ]
    },
    // {
    //   id: 'etiquette',
    //   title: '5. Pace of Play & Etiquette',
    //   icon: '⏱️',
    //   isOpen: false,
    //   content: [
    //     'Please maintain a maximum pace of play of 15 minutes per hole.',
    //     'Repair all divots, pitch marks on greens, and rake bunkers after play.',
    //     'In the event of a lost ball, spend no more than 3 minutes searching before playing a local rule drop.'
    //   ]
    // }
  ];

  toggleAccordion(index: number): void {
    // Toggle clicked item; close others (or remove the second part to allow multiple open)
    this.rules[index].isOpen = !this.rules[index].isOpen;
  }

}
