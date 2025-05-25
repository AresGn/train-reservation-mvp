import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ReservationService } from '../../../services/reservation.service';
import { Reservation } from '../../../models/reservation.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  reservation: Reservation | null = null;
  isLoading = true;
  reservationId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.reservationId = params['reservationId'];
      this.loadReservationDetails();
    });
  }

  private loadReservationDetails(): void {
    // 🎭 MVP: Utiliser les données simulées existantes
    const currentReservation = this.reservationService.getCurrentReservationState();
    if (currentReservation) {
      this.reservation = currentReservation as Reservation;
      this.isLoading = false;
    } else {
      // Si aucune réservation n'est trouvée, créer des données simulées
      this.reservationService.createMockReservationForTesting();
      setTimeout(() => {
        this.reservation = this.reservationService.getCurrentReservationState() as Reservation;
        this.isLoading = false;
      }, 100);
    }
  }

  downloadPDF(): void {
    // 🎭 MVP: Simulation du téléchargement PDF
    this.snackBar.open('🎭 MVP: Téléchargement PDF simulé - Fonctionnalité en développement', 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
    console.log('🎭 Simulation: Téléchargement du billet PDF pour la réservation', this.reservationId);
  }

  shareTicket(): void {
    // 🎭 MVP: Simulation du partage
    if (navigator.share) {
      navigator.share({
        title: 'Mon billet de train',
        text: `Billet de train ${this.reservation?.selectedTrain?.trainType} - ${this.reservation?.selectedTrain?.departureLocation} → ${this.reservation?.selectedTrain?.arrivalLocation}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage
      this.snackBar.open('🎭 MVP: Partage simulé - Lien copié dans le presse-papiers', 'OK', {
        duration: 3000
      });
    }
  }

  addToCalendar(): void {
    // 🎭 MVP: Simulation d'ajout au calendrier
    this.snackBar.open('🎭 MVP: Ajout au calendrier simulé - Fonctionnalité en développement', 'OK', {
      duration: 3000,
      panelClass: ['info-snackbar']
    });
    console.log('🎭 Simulation: Ajout au calendrier pour le', this.reservation?.selectedTrain?.departureDate);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  bookAnother(): void {
    // Nettoyer les données de réservation et retourner à la recherche
    this.reservationService.clearReservation();
    this.router.navigate(['/search']);
  }

  // Méthodes utilitaires pour l'affichage
  getPassengerStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'standard': 'Standard',
      'student': 'Étudiant (-30%)',
      'senior': '3ème âge (-35%)'
    };
    return statusMap[status] || 'Standard';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) {
      return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(new Date());
    }
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }

  formatTime(time: string): string {
    return time;
  }
}
