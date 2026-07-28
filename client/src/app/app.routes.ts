import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'board-page',
        pathMatch: 'full'
    },
    {
        path: 'board-page',
        loadComponent: () => import('@app/pages/board-page/board-page').then(m => m.BoardPage)
    },
    {
        path: 'score-page',
        loadComponent: () => import('@app/pages/score-page/score-page').then(m => m.ScorePage)
    },
    {
        path: 'rule-page',
        loadComponent: () => import('@app/pages/rule-page/rule-page').then(m => m.RulePage)
    },
    {
        path: 'admin-page',
        loadComponent: () => import('@app/pages/admin-page/admin-page').then(m => m.AdminPage)
    },
    {
        path: 'player-management-page',
        loadComponent: () => import('@app/pages/player-management-page/player-management-page').then(m => m.PlayerManagementPage)
    }
];
