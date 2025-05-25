import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private router: Router) {}

  // 🎭 Méthodes MVP pour navigation rapide
  navigateToSearch(): void {
    console.log('🎭 MVP: Navigation rapide vers la recherche de trains');
    this.router.navigate(['/search']);
  }

  navigateToPayment(): void {
    console.log('🎭 MVP: Navigation rapide vers le test de paiement');
    this.router.navigate(['/payment']);
  }
}
