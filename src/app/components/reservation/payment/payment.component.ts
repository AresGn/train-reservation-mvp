import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ReservationService } from '../../../services/reservation.service';
import { PaymentService } from '../../../services/payment.service';
import { Reservation, PartialReservation } from '../../../models/reservation.model';
import { PaymentDetail, PaymentProcess } from '../../../models/payment.model';

interface PaymentMethodOption {
  value: 'airtel' | 'moov' | 'orange';
  label: string;
  icon?: string; // for displaying logos
  countryCode: string; // Gabonese country code for phone numbers
  pattern: RegExp; // Regex for phone number validation
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  paymentForm!: FormGroup;
  currentReservation$: Observable<PartialReservation | null>;
  currentReservation: PartialReservation | null = null;
  private reservationSubscription?: Subscription;

  isLoading = false;
  paymentProcessing = false;
  errorMessage: string | null = null;

  // 🎭 MVP: Validation simplifiée pour tester l'idée - accepte tout numéro de 7-8 chiffres
  paymentMethods: PaymentMethodOption[] = [
    { value: 'airtel', label: 'Airtel Money', icon: 'assets/icons/airtel-money.png', countryCode: '+241', pattern: /^(0?[0-9]{7,8}|[0-9]{7,8})$/ },
    { value: 'moov', label: 'Moov Money (Flooz)', icon: 'assets/icons/moov-money.png', countryCode: '+241', pattern: /^(0?[0-9]{7,8}|[0-9]{7,8})$/ },
    { value: 'orange', label: 'Orange Money', icon: 'assets/icons/orange-money.png', countryCode: '+241', pattern: /^(0?[0-9]{7,8}|[0-9]{7,8})$/ }
  ];
  selectedPaymentMethod: PaymentMethodOption | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private reservationService: ReservationService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {
    this.currentReservation$ = this.reservationService.currentReservation$;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.reservationSubscription = this.currentReservation$.subscribe(reservation => {
      if (reservation && reservation.totalPrice && reservation.id) {
        this.currentReservation = reservation as Reservation;
        this.initializeForm();
      } else {
        // 🎭 MVP: Créer automatiquement des données simulées pour tester le paiement
        console.log('🎭 MVP Mode: Aucune réservation trouvée, création de données simulées...');
        this.createSimulatedReservationForMVP();
      }
      this.isLoading = false;
    }, (error: any) => {
      this.errorMessage = 'Erreur lors du chargement de la réservation.';
      this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
      this.isLoading = false;
    });
  }

  // 🎭 Méthode pour créer une réservation simulée pour le MVP
  private createSimulatedReservationForMVP(): void {
    console.log('🎭 Création d\'une réservation simulée pour tester le paiement...');

    // Utiliser la méthode existante du service pour créer des données simulées
    this.reservationService.createMockReservationForTesting();

    // Afficher un message informatif pour l'utilisateur
    this.snackBar.open('🎭 Mode MVP: Données de test créées pour démonstration', 'OK', {
      duration: 4000,
      panelClass: ['info-snackbar']
    });

    // Recharger la réservation après création des données simulées
    setTimeout(() => {
      const currentReservation = this.reservationService.getCurrentReservationState();
      if (currentReservation) {
        this.currentReservation = currentReservation;
        this.initializeForm();
        console.log('🎭 Réservation simulée chargée:', currentReservation);
      }
    }, 100);
  }

  initializeForm(): void {
    this.paymentForm = this.fb.group({
      paymentMethod: [null, Validators.required],
      phoneNumber: ['', [Validators.required]]
    });

    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(methodValue => {
      this.selectedPaymentMethod = this.paymentMethods.find(pm => pm.value === methodValue) || null;
      this.updatePhoneNumberValidation();
    });
  }

  updatePhoneNumberValidation(): void {
    const phoneControl = this.paymentForm.get('phoneNumber');
    if (phoneControl && this.selectedPaymentMethod) {
      phoneControl.setValidators([Validators.required, Validators.pattern(this.selectedPaymentMethod.pattern)]);
    } else if (phoneControl) {
      phoneControl.setValidators([Validators.required]);
    }
    phoneControl?.updateValueAndValidity();
  }

  get phoneNumberControl(): AbstractControl | null {
    return this.paymentForm.get('phoneNumber');
  }

  onSubmit(): void {
    if (!this.paymentForm.valid || !this.currentReservation || !this.selectedPaymentMethod) {
      this.errorMessage = 'Veuillez sélectionner un mode de paiement et remplir les informations requises.';
      this.snackBar.open(this.errorMessage, 'Fermer', { duration: 3000 });
      return;
    }

    this.paymentProcessing = true;
    this.errorMessage = null;

    const paymentDetail: PaymentDetail = {
      paymentMethod: this.selectedPaymentMethod.value,
      phoneNumber: this.selectedPaymentMethod.countryCode + this.paymentForm.value.phoneNumber.replace(/^0+/, '')
    };

    this.paymentService.processPayment(this.currentReservation as Reservation, paymentDetail)
      .pipe(
        tap((paymentProcess: PaymentProcess) => {
          console.log('Payment process tap:', paymentProcess);
          this.snackBar.open(`Paiement ${paymentProcess.status === 'success' ? 'réussi' : 'échoué'}. Transaction ID: ${paymentProcess.transactionId || 'N/A'}`, 'Fermer', { duration: 5000 });
        }),
        catchError((error: PaymentProcess | any) => {
          console.error('Payment processing error caught in component:', error);
          this.errorMessage = error.errorMessage || 'Une erreur est survenue lors du traitement du paiement.';
          this.snackBar.open(this.errorMessage || 'Erreur de paiement', 'Fermer', { duration: 7000 });
          return throwError(() => error);
        }),
        finalize(() => {
          this.paymentProcessing = false;
          console.log('Finalize block reached, paymentProcessing:', this.paymentProcessing);
        })
      )
      .subscribe({
        next: (paymentResult: PaymentProcess) => {
          if (paymentResult.status === 'success') {
            this.router.navigate(['/confirmation'], { queryParams: { reservationId: this.currentReservation?.id } });
          } else {
             console.warn('Payment attempt resulted in status:', paymentResult.status);
          }
        },
        error: (err: PaymentProcess | any) => {
           console.error('Final error subscription block:', err);
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/passenger-details']);
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

  getTicketTypeLabel(ticketType: string): string {
    const typeMap: { [key: string]: string } = {
      'standard': 'Standard',
      'business': 'Business',
      'first': 'Première classe'
    };
    return typeMap[ticketType] || 'Standard';
  }

  getPaymentMethodIcon(method: string): string {
    const iconMap: { [key: string]: string } = {
      'airtel': 'smartphone',
      'moov': 'phone_android',
      'orange': 'mobile_friendly'
    };
    return iconMap[method] || 'payment';
  }

  getPhoneNumberExample(method: string): string {
    const exampleMap: { [key: string]: string } = {
      'airtel': '+241 09 87 54 56',
      'moov': '+241 02 12 34 56',
      'orange': '+241 77 12 34 56'
    };
    return exampleMap[method] || '+241 XX XX XX XX';
  }

  getPhoneNumberPlaceholder(method: string): string {
    const placeholderMap: { [key: string]: string } = {
      'airtel': '09875456',
      'moov': '02123456',
      'orange': '77123456'
    };
    return placeholderMap[method] || 'XXXXXXXX';
  }

  ngOnDestroy(): void {
    if (this.reservationSubscription) {
      this.reservationSubscription.unsubscribe();
    }
  }
}
