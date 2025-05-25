import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReservationService } from '../../../services/reservation.service';
import { Passenger as PassengerData } from '../../../models/passenger.model'; 
import { PartialReservation, Passenger as ReservationPassenger } from '../../../models/reservation.model';
import { PassengerCategory } from '../../../models/train.model';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.scss']
})
export class PassengerDetailsComponent implements OnInit {
  passengerForm!: FormGroup;
  currentReservation: PartialReservation | null = null;
  isLoading = true;
  errorMessage: string | null = null;
  baseTrainPrice = 0;

  ticketTypes = [
    { value: 'standard', label: 'Standard' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'Première classe' }
  ];

  passengerStatuses = [
    { value: 'standard', label: 'Standard', discount: 0 },
    { value: 'student', label: 'Étudiant (30% de réduction)', discount: 0.30 },
    { value: 'senior', label: '3ème âge (35% de réduction)', discount: 0.35 }
  ];

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.passengerForm = this.fb.group({
      passengers: this.fb.array([])
    });
    this.loadReservationData();
  }

  loadReservationData(): void {
    this.isLoading = true;
    this.currentReservation = this.reservationService.getCurrentReservationState();

    if (!this.currentReservation || !this.currentReservation.selectedTrain || this.currentReservation.passengerCount === undefined) {
      this.errorMessage = "Impossible de charger les détails de la réservation. Veuillez recommencer la recherche.";
      this.isLoading = false;
      return;
    }

    this.baseTrainPrice = this.currentReservation.selectedTrain.basePrice;
    this.initializeFormBasedOnCount(this.currentReservation.passengerCount);
    this.isLoading = false;
  }

  initializeFormBasedOnCount(passengerCount: number): void {
    const passengersArray = this.passengerForm.get('passengers') as FormArray;
    passengersArray.clear(); 

    for (let i = 0; i < passengerCount; i++) {
      const passengerGroup = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        age: ['', [Validators.required, Validators.min(0), Validators.max(120)]],
        status: ['standard', Validators.required],
        ticketType: ['standard', Validators.required],
        emergencyContact: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{8,}$')]],
        price: [{ value: this.calculatePrice('standard', 'standard'), disabled: true }]
      });

      passengerGroup.get('status')?.valueChanges.subscribe(statusValue => {
        const ticketTypeValue = passengerGroup.get('ticketType')?.value;
        const newPrice = this.calculatePrice(statusValue ?? 'standard', ticketTypeValue ?? 'standard');
        passengerGroup.get('price')?.setValue(newPrice, { emitEvent: false });
        this.updateTotalReservationPrice();
      });

      passengerGroup.get('ticketType')?.valueChanges.subscribe(ticketTypeValue => {
        const statusValue = passengerGroup.get('status')?.value;
        const newPrice = this.calculatePrice(statusValue ?? 'standard', ticketTypeValue ?? 'standard');
        passengerGroup.get('price')?.setValue(newPrice, { emitEvent: false });
        this.updateTotalReservationPrice();
      });
      passengersArray.push(passengerGroup);
    }
    this.updateTotalReservationPrice();
  }

  get passengersFormArray(): FormArray {
    return this.passengerForm.get('passengers') as FormArray;
  }

  calculatePrice(statusValue: string, ticketTypeValue: string): number {
    let price = this.baseTrainPrice;
    const statusInfo = this.passengerStatuses.find(s => s.value === statusValue);
    if (statusInfo) {
      price = price * (1 - statusInfo.discount);
    }
    switch (ticketTypeValue) {
      case 'business': price *= 1.5; break;
      case 'first': price *= 2; break;
    }
    return parseFloat(price.toFixed(2));
  }
  
  updateTotalReservationPrice(): void {
    if(this.currentReservation){
        this.currentReservation.totalPrice = this.passengersFormArray.controls
        .reduce((total, passengerControl) => total + (passengerControl.get('price')?.value || 0),0);
    }
  }

  getTotalPriceDisplay(): number {
     return this.passengersFormArray.controls
        .reduce((total, passengerControl) => total + (passengerControl.get('price')?.value || 0),0);
  }

  goBack(): void {
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

    const passengersDataFromForm: PassengerData[] = this.passengersFormArray.value.map((pVal: any) => ({
        firstName: pVal.firstName,
        lastName: pVal.lastName,
        age: pVal.age,
        status: pVal.status,
        ticketType: pVal.ticketType,
        emergencyContact: pVal.emergencyContact,
        price: pVal.price
    }));
    
    const reservationPassengers: ReservationPassenger[] = passengersDataFromForm.map(p => ({
        id: this.reservationService.generatePassengerId(),
        name: `${p.firstName} ${p.lastName}`,
        age: p.age,
        passengerCategory: p.status as PassengerCategory,
        ticketType: p.ticketType,
        emergencyContact: p.emergencyContact,
        price: p.price || 0,
    }));

    this.reservationService.updatePassengerDetails(reservationPassengers).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/payment']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = `Erreur lors de la mise à jour des passagers: ${err.message || 'Erreur inconnue'}`;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray) {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
