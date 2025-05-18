import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private isAuthenticated = false;
  authStateChanged = new Subject<boolean>();

  constructor() {
    // Simuler un utilisateur connecté pour le développement
    this.currentUser = null;
    this.isAuthenticated = false;
  }

  login(email: string, password: string): boolean {
    // Simulation d'authentification pour le MVP
    if (email && password) {
      this.currentUser = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: email
      };
      this.isAuthenticated = true;
      this.authStateChanged.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authStateChanged.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
