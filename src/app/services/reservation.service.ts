import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Train, PassengerCategory } from '../models/train.model';

export interface SearchCriteria {
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  departureTime?: string;
  passengerCount: number;
  passengerCategory: PassengerCategory;
}

export interface Reservation {
  id?: string;
  userId?: string;
  train: Train;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  departureTime: string;
  passengerCount: number;
  passengerCategory: PassengerCategory;
  totalPrice?: number;
  status?: 'pending' | 'confirmed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private currentReservation = new BehaviorSubject<Reservation | null>(null);
  public currentReservation$ = this.currentReservation.asObservable();

  private searchCriteria = new BehaviorSubject<SearchCriteria | null>(null);
  public searchCriteria$ = this.searchCriteria.asObservable();

  private selectedTrain = new BehaviorSubject<Train | null>(null);
  public selectedTrain$ = this.selectedTrain.asObservable();

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // Restaurer l'état depuis le localStorage si disponible
    if (this.isBrowser) {
      const storedCriteria = localStorage.getItem('searchCriteria');
      const storedTrain = localStorage.getItem('selectedTrain');
      const storedReservation = localStorage.getItem('currentReservation');

      if (storedCriteria) {
        const criteria = JSON.parse(storedCriteria);
        // Convertir la chaîne de date en objet Date
        if (criteria.departureDate) {
          criteria.departureDate = new Date(criteria.departureDate);
        }
        this.searchCriteria.next(criteria);
      }

      if (storedTrain) {
        const train = JSON.parse(storedTrain);
        // Convertir la chaîne de date en objet Date
        if (train.departureDate) {
          train.departureDate = new Date(train.departureDate);
        }
        this.selectedTrain.next(train);
      }

      if (storedReservation) {
        const reservation = JSON.parse(storedReservation);
        // Convertir la chaîne de date en objet Date
        if (reservation.departureDate) {
          reservation.departureDate = new Date(reservation.departureDate);
        }
        if (reservation.createdAt) {
          reservation.createdAt = new Date(reservation.createdAt);
        }
        if (reservation.updatedAt) {
          reservation.updatedAt = new Date(reservation.updatedAt);
        }
        this.currentReservation.next(reservation);
      }
    }
  }

  setSearchCriteria(criteria: SearchCriteria): void {
    this.searchCriteria.next(criteria);
    if (this.isBrowser) {
      localStorage.setItem('searchCriteria', JSON.stringify(criteria));
    }
  }

  setSelectedTrain(train: Train): void {
    this.selectedTrain.next(train);
    if (this.isBrowser) {
      localStorage.setItem('selectedTrain', JSON.stringify(train));
    }

    // Si nous avons des critères de recherche et un train, créer une réservation
    const criteria = this.searchCriteria.getValue();
    if (criteria) {
      const reservation: Reservation = {
        train,
        departureLocation: criteria.departureLocation,
        arrivalLocation: criteria.arrivalLocation,
        departureDate: criteria.departureDate,
        departureTime: train.departureTime,
        passengerCount: criteria.passengerCount,
        passengerCategory: criteria.passengerCategory,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.currentReservation.next(reservation);
      
      if (this.isBrowser) {
        localStorage.setItem('currentReservation', JSON.stringify(reservation));
      }
    }
  }

  clearReservation(): void {
    this.currentReservation.next(null);
    this.selectedTrain.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('selectedTrain');
      localStorage.removeItem('currentReservation');
    }
  }

  clearAll(): void {
    this.clearReservation();
    this.searchCriteria.next(null);
    if (this.isBrowser) {
      localStorage.removeItem('searchCriteria');
    }
  }
}
