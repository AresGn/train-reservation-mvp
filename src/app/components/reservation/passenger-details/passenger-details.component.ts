import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { Passenger, PartialReservation } from '../../../models/reservation.model';
import { PassengerCategory } from '../../../models/train.model';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.scss']
})
export class PassengerDetailsComponent implements OnInit {
  passengerForm!: FormGroup;
  currentReservation: PartialReservation | null = null;
  passengerCategories = Object.values(PassengerCategory);
  isLoading = true;
  errorMessage: string | null = null;
  baseTrainPrice = 0;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservationData();
  }

  loadReservationData(): void {
    this.currentReservation = this.reservationService.getCurrentReservationState();
    if (!this.currentReservation || !this.currentReservation.selectedTrain || !this.currentReservation.passengers) {
      this.errorMessage = "Impossible de charger les détails de la réservation. Veuillez recommencer la recherche.";
      this.isLoading = false;
      // Optionnellement, rediriger vers la page de recherche
      // this.router.navigate(['/search']);
      return;
    }
    this.baseTrainPrice = this.currentReservation.selectedTrain.basePrice;
    this.initializeForm(this.currentReservation.passengers);
    this.isLoading = false;
  }

  initializeForm(passengersData: Passenger[]): void {
    this.passengerForm = this.fb.group({
      passengers: this.fb.array([])
    });

    passengersData.forEach(passenger => {
      this.addPassengerToForm(passenger);
    });

    // Écouter les changements pour recalculer les prix dynamiquement
    this.passengersFormArray.valueChanges.subscribe(passengers => {
      this.updatePrices(passengers);
    });
  }

  get passengersFormArray(): FormArray {
    return this.passengerForm.get('passengers') as FormArray;
  }

  addPassengerToForm(passenger: Passenger): void {
    const passengerGroup = this.fb.group({
      id: [passenger.id],
      name: [passenger.name, Validators.required],
      age: [passenger.age, [Validators.required, Validators.min(0), Validators.max(120)]],
      passengerCategory: [passenger.passengerCategory, Validators.required],
      seatPreference: [passenger.seatPreference || ''],
      emergencyContact: [passenger.emergencyContact || '', Validators.pattern(/^(\+?\d{1,3}[- ]?)?\d{9,11}$/)], // Simple validation de numéro
      price: [{value: passenger.price, disabled: true}] // Le prix est affiché mais non modifiable directement
    });
    this.passengersFormArray.push(passengerGroup);
  }

  updatePrices(passengersValues: any[]): void {
    if (!this.currentReservation || !this.currentReservation.selectedTrain) return;

    const updatedPassengers: Passenger[] = passengersValues.map((pVal, index) => {
      const originalPassenger = this.currentReservation!.passengers![index];
      const updatedPassenger: Passenger = {
        ...originalPassenger, // Conserve l'ID et autres infos non modifiées par le formulaire
        name: pVal.name,
        age: pVal.age,
        passengerCategory: pVal.passengerCategory,
        seatPreference: pVal.seatPreference,
        emergencyContact: pVal.emergencyContact,
        // Le prix sera recalculé par le service
        price: 0 // Sera mis à jour par calculatePassengerPrice
      };
       // Mettre à jour le contrôle de formulaire avec le prix calculé (si on veut l'afficher)
      const calculatedPrice = this.reservationService.calculatePassengerPrice(updatedPassenger, this.baseTrainPrice);
      this.passengersFormArray.at(index).get('price')?.setValue(calculatedPrice, { emitEvent: false });
      updatedPassenger.price = calculatedPrice; // S'assurer que le prix est bien celui calculé
      return updatedPassenger;
    });

    const totalPrice = updatedPassengers.reduce((sum, p) => sum + p.price, 0);
    this.currentReservation.passengers = updatedPassengers;
    this.currentReservation.totalPrice = totalPrice;
    // Optionnel: mettre à jour l'état dans le service si on veut que d'autres composants y réagissent immédiatement
    // this.reservationService.updatePartialReservation({ passengers: updatedPassengers, totalPrice });
  }

  // Méthode pour afficher les catégories de passagers de manière lisible
  getPassengerCategoryLabel(categoryValue: PassengerCategory): string {
    switch (categoryValue) {
      case PassengerCategory.STANDARD: return 'Standard';
      case PassengerCategory.STUDENT: return 'Étudiant';
      case PassengerCategory.SENIOR: return 'Senior';
      default: return categoryValue;
    }
  }

  goBack(): void {
    // Naviguer vers la page de sélection de train
    // L'état de la réservation (train sélectionné, etc.) est conservé dans le service
    this.router.navigate(['/select-train']);
  }

  onSubmit(): void {
    if (this.passengerForm.invalid) {
      this.markFormGroupTouched(this.passengerForm);
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
      return;
    }
    this.errorMessage = null;
    this.isLoading = true;

    const finalPassengers = this.passengersFormArray.value.map((pVal: any, index: number) => {
        const originalPassenger = this.currentReservation!.passengers![index];
        return {
            ...originalPassenger,
            name: pVal.name,
            age: pVal.age,
            passengerCategory: pVal.passengerCategory,
            seatPreference: pVal.seatPreference,
            emergencyContact: pVal.emergencyContact,
            price: this.passengersFormArray.at(index).get('price')?.value // Utiliser le prix déjà calculé et affiché
        };
    });

    this.reservationService.updatePassengerDetails(finalPassengers).subscribe({
      next: (updatedReservation) => {
        this.isLoading = false;
        this.router.navigate(['/payment']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Erreur lors de la mise à jour des passagers: ${err.message}`;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
