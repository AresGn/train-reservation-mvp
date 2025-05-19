import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    ClickOutsideDirective
  ]
})
export class HeaderComponent implements OnInit {
  menuOpen = false;
  userMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  userEmail = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pour le MVP, on peut simuler un état de connexion
    // Dans une version finale, on utiliserait le service d'authentification
    this.checkLoginStatus();
    
    // S'abonner aux changements d'état de connexion
    this.authService.authState$.subscribe(() => {
      this.checkLoginStatus();
    });

    // Fermer le menu lorsque l'utilisateur navigue vers une autre page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.menuOpen = false;
      this.userMenuOpen = false;
    });

    // Pour le test, simulons une connexion après 2 secondes
    // setTimeout(() => {
    //   this.authService.login('test@example.com', 'password');
    // }, 2000);
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userName = `${user.firstName} ${user.lastName}`;
        this.userEmail = user.email;
      }
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      // Fermer le menu utilisateur s'il est ouvert
      this.userMenuOpen = false;
      // Ajouter une classe pour empêcher le défilement du body
      document.body.classList.add('menu-open');
    } else {
      // Supprimer la classe lorsque le menu est fermé
      document.body.classList.remove('menu-open');
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  closeMenu(): void {
    if (this.menuOpen) {
      this.menuOpen = false;
      document.body.classList.remove('menu-open');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeUserMenu();
    this.closeMenu();
  }

  // Fermer le menu lorsque l'écran est redimensionné
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth > 768) {
      this.menuOpen = false;
      document.body.classList.remove('menu-open');
    }
  }
}