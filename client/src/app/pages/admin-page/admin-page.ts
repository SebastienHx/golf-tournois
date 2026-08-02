import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminLockSection } from '@app/components/admin-lock-section/admin-lock-section';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, AdminLockSection],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage {
  isUnlocked = signal<boolean>(false);

  constructor(private readonly router: Router) {}

  onUnlock(unlocked: boolean): void {
    this.isUnlocked.set(unlocked);
  }

  openPlayerManagement(): void {
    this.router.navigate(['/player-management-page']);
  }

  openFoursomeDuoManagement(): void {
    this.router.navigate(['/foursome-duo-management-page']);
  }
}
