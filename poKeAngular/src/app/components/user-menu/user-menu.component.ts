import { CommonModule } from '@angular/common';
import { Component, type OnDestroy, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import type { Subscription } from 'rxjs';
import type { User } from '../../models/pokemon.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.css'],
})
export class UserMenuComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  showDropdown = false;
  private userSubscription?: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(
      (user: User | null) => {
        this.currentUser = user;
      }
    );

    document.addEventListener('click', this.closeDropdown.bind(this));
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    document.removeEventListener('click', this.closeDropdown.bind(this));
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  logout(): void {
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/login']);
  }

  goToFavorites(): void {
    this.showDropdown = false;
    this.router.navigate(['/favorites']);
  }

  private closeDropdown(): void {
    this.showDropdown = false;
  }
}
