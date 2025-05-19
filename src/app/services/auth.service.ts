import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;
  private isAuthenticated = false;
  private authStateSubject = new BehaviorSubject<boolean>(false);
  public authState$: Observable<boolean> = this.authStateSubject.asObservable();

  // Mock des utilisateurs pour simuler une base de données
  private users: User[] = [];
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Vérifier si on est dans un environnement navigateur et si un utilisateur est déjà stocké
    if (this.isBrowser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
        this.isAuthenticated = true;
        this.authStateSubject.next(true);
      }
    }
  }

  register(user: User): Observable<User> {
    // Simulation d'un délai réseau
    return of(user).pipe(
      delay(800),
      tap(newUser => {
        // Générer un ID unique simulé
        const newUserId = `user-${Date.now()}`;
        
        // Créer l'utilisateur avec les champs additionnels
        const createdUser: User = {
          ...newUser,
          id: newUserId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        // Ajouter l'utilisateur à notre "base de données" simulée
        this.users.push(createdUser);
        
        // Stocker l'utilisateur courant (sans le mot de passe)
        const { password, ...userWithoutPassword } = createdUser;
        this.currentUser = userWithoutPassword;
        this.isAuthenticated = true;
        
        // Notifier les abonnés du changement d'état d'authentification
        this.authStateSubject.next(true);
        
        // Sauvegarder dans le localStorage seulement côté navigateur
        if (this.isBrowser) {
          localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        }
      })
    );
  }

  login(email: string, password: string): Observable<boolean> {
    // Simulation d'authentification pour le MVP
    return of(true).pipe(
      delay(800),
      tap(success => {
        if (email && password) {
          // Recherche d'un utilisateur existant (simulé)
          const user = this.users.find(u => u.email === email);
          
          if (user) {
            // Stockage de l'utilisateur sans le mot de passe
            const { password, ...userWithoutPassword } = user;
            this.currentUser = userWithoutPassword;
          } else {
            // Création d'un utilisateur de test si aucun n'existe
            this.currentUser = {
              id: 'test-user',
              firstName: 'John',
              lastName: 'Doe',
              email: email,
              gender: 'male',
              residence: 'Paris',
              age: 35,
              nationality: 'Française'
            };
          }
          
          this.isAuthenticated = true;
          this.authStateSubject.next(true);
          
          // Sauvegarder dans le localStorage seulement côté navigateur
          if (this.isBrowser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          }
        } else {
          this.isAuthenticated = false;
          this.authStateSubject.next(false);
        }
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authStateSubject.next(false);
    
    // Supprimer du localStorage seulement côté navigateur
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
    }
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
