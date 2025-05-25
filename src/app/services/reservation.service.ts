import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { Train, PassengerCategory, Station } from '../models/train.model';
import { Reservation, Passenger, PartialReservation } from '../models/reservation.model';
import { TrainService } from './train.service';

export interface SearchCriteria {
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  departureTime?: string;
  passengerCount: number;
  passengerCategory: PassengerCategory;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private currentReservationState = new BehaviorSubject<PartialReservation | null>(null);
  currentReservation$ = this.currentReservationState.asObservable();

  // Garder une trace des critères de recherche initiaux
  private searchCriteriaState = new BehaviorSubject<SearchCriteria | null>(null);
  searchCriteria$ = this.searchCriteriaState.asObservable();

  private MOCK_RESERVATIONS: Reservation[] = []; // Pour simuler une base de données

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private trainService: TrainService) {
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
        this.searchCriteriaState.next(criteria);
      }

      if (storedTrain) {
        const train = JSON.parse(storedTrain);
        // Convertir la chaîne de date en objet Date
        if (train.departureDate) {
          train.departureDate = new Date(train.departureDate);
        }
        // this.selectedTrain.next(train); // Commenté car selectedTrain n'est pas une propriété du service
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
        this.currentReservationState.next(reservation);
      }
    }

    // Initialiser avec des données mockées si nécessaire pour le développement
    this.loadMockReservations();
  }

  private loadMockReservations(): void {
    // Créer des données simulées pour tester le MVP
    this.createMockReservationForTesting();
  }

  // Méthode pour créer une réservation simulée pour tester le paiement
  createMockReservationForTesting(): void {
    const mockTrain: Train = {
      id: 'TGV-001',
      departureLocation: 'Owendo',
      arrivalLocation: 'Franceville',
      departureDate: new Date('2024-01-15'),
      departureTime: '08:30',
      arrivalTime: '12:45',
      duration: '4h15',
      durationInMinutes: 255,
      trainType: 'TGV Express',
      basePrice: 25000,
      availableSeats: 150,
      features: ['WiFi', 'Restauration', 'Climatisation', 'Siège inclinable']
    };

    const mockDepartureStation: Station = {
      id: 'owendo',
      name: 'Owendo',
      city: 'Libreville',
      isMainStation: true,
      latitude: 0.3017,
      longitude: 9.5372
    };

    const mockArrivalStation: Station = {
      id: 'franceville',
      name: 'Franceville',
      city: 'Franceville',
      isMainStation: true,
      latitude: -1.6333,
      longitude: 13.5833
    };

    const mockPassengers: Passenger[] = [
      {
        id: 'pass-001',
        name: 'Jean Dupont',
        age: 35,
        passengerCategory: PassengerCategory.STANDARD,
        price: 25000
      },
      {
        id: 'pass-002',
        name: 'Marie Mbadinga',
        age: 22,
        passengerCategory: PassengerCategory.STUDENT,
        price: 17500 // -30% réduction étudiant
      }
    ];

    const mockReservation: PartialReservation = {
      id: 'mock-reservation-001',
      selectedTrain: mockTrain,
      departureStation: mockDepartureStation,
      arrivalStation: mockArrivalStation,
      departureDateTime: new Date('2024-01-15T08:30:00'),
      arrivalDateTime: new Date('2024-01-15T12:45:00'),
      passengers: mockPassengers,
      totalPrice: 42500,
      passengerCount: 2,
      searchPassengerCategory: PassengerCategory.STANDARD,
      status: 'pending'
    };

    // Sauvegarder la réservation simulée
    this.currentReservationState.next(mockReservation);

    if (this.isBrowser) {
      localStorage.setItem('currentReservation', JSON.stringify(mockReservation));
    }

    console.log('🎭 Données simulées créées pour le MVP:', mockReservation);
  }

  setSearchCriteria(criteria: SearchCriteria): void {
    this.searchCriteriaState.next(criteria);
    // Initialiser ou réinitialiser la réservation partielle avec les nouvelles infos de recherche
    const initialPartialReservation: PartialReservation = {
      passengerCount: criteria.passengerCount,
      searchPassengerCategory: criteria.passengerCategory,
      // On ne connait pas encore le train, ni les dates/heures exactes avant la sélection du train
    };
    this.currentReservationState.next(initialPartialReservation);
    if (this.isBrowser) {
      localStorage.setItem('searchCriteria', JSON.stringify(criteria));
    }
  }

  getSearchCriteria(): SearchCriteria | null {
    return this.searchCriteriaState.getValue();
  }

  updatePartialReservation(update: Partial<PartialReservation>): void {
    const currentState = this.currentReservationState.getValue();
    this.currentReservationState.next({ ...currentState, ...update });
  }

  getCurrentReservationState(): PartialReservation | null {
    return this.currentReservationState.getValue();
  }

  // Logique pour sélectionner un train et mettre à jour la réservation partielle
  selectTrain(train: Train): Observable<PartialReservation> {
    const criteria = this.getSearchCriteria();
    if (!criteria) {
      return throwError(() => new Error('Search criteria not available.'));
    }

    const departureStation = this.trainService.getStationByName(criteria.departureLocation);
    const arrivalStation = this.trainService.getStationByName(criteria.arrivalLocation);

    if (!departureStation || !arrivalStation) {
      return throwError(() => new Error('Departure or arrival station not found.'));
    }

    // Construire les dates/heures complètes
    const departureDateTime = this.trainService.combineDateAndTime(criteria.departureDate, train.departureTime);
    const arrivalDateTime = this.trainService.combineDateAndTime(criteria.departureDate, train.arrivalTime, train.durationInMinutes);

    const partialReservationUpdate: PartialReservation = {
      selectedTrain: train,
      departureStation: departureStation,
      arrivalStation: arrivalStation,
      departureDateTime: departureDateTime,
      arrivalDateTime: arrivalDateTime,
      passengers: this.initializePassengers(criteria.passengerCount, criteria.passengerCategory, train.basePrice),
      // Le prix total sera recalculé après la saisie des détails passagers
    };

    this.updatePartialReservation(partialReservationUpdate);
    return of(this.getCurrentReservationState()!);
  }

  initializePassengers(count: number, category: PassengerCategory, basePrice: number): Passenger[] {
    const passengers: Passenger[] = [];
    for (let i = 0; i < count; i++) {
      passengers.push({
        id: `passenger-${i + 1}`,
        name: '',
        age: 0, // Sera rempli par l'utilisateur
        passengerCategory: category, // La catégorie générale s'applique, peut être affinée par passager
        price: this.calculateInitialPassengerPrice(category, basePrice) // Prix initial basé sur la catégorie
      });
    }
    return passengers;
  }

  calculateInitialPassengerPrice(category: PassengerCategory, basePrice: number): number {
    let priceModifier = 1;
    switch (category) {
      case PassengerCategory.STUDENT:
        priceModifier = 0.7; // -30%
        break;
      case PassengerCategory.SENIOR:
        priceModifier = 0.65; // -35%
        break;
      // PassengerCategory.STANDARD n'a pas de modificateur
    }
    return basePrice * priceModifier;
  }

  updatePassengerDetails(passengers: Passenger[]): Observable<PartialReservation> {
    const currentReservation = this.getCurrentReservationState();
    if (!currentReservation || !currentReservation.selectedTrain) {
      return throwError(() => new Error('No active reservation or train selected.'));
    }

    const updatedPassengers = passengers.map(p => ({
      ...p,
      price: this.calculatePassengerPrice(p, currentReservation.selectedTrain!.basePrice)
    }));

    const totalPrice = updatedPassengers.reduce((sum, p) => sum + p.price, 0);

    this.updatePartialReservation({ passengers: updatedPassengers, totalPrice });
    return of(this.getCurrentReservationState()!);
  }

  calculatePassengerPrice(passenger: Passenger, baseTrainPrice: number): number {
    let finalPrice = baseTrainPrice;
    // Logique de réduction basée sur l'âge (si définie) ou la catégorie du passager
    // Pour l'instant, on se base sur passenger.passengerCategory qui peut être affinée
    if (passenger.age > 0) { // Exemple: si l'âge est renseigné, il peut primer
        if (passenger.age <= 12) finalPrice *= 0.5; // Enfant -50%
        else if (passenger.age >= 60 && passenger.passengerCategory === PassengerCategory.SENIOR) finalPrice *= 0.65;
        else if (passenger.age <= 25 && passenger.passengerCategory === PassengerCategory.STUDENT) finalPrice *= 0.70;
    } else {
        // Si l'âge n'est pas encore là, utiliser la catégorie générale
        finalPrice = this.calculateInitialPassengerPrice(passenger.passengerCategory, baseTrainPrice);
    }
    // Assurer que le prix n'est pas négatif et a deux décimales
    return Math.max(0, parseFloat(finalPrice.toFixed(2)));
  }

  // Simuler la finalisation de la réservation
  finalizeReservation(): Observable<Reservation> {
    const currentPartial = this.getCurrentReservationState();
    const criteria = this.getSearchCriteria();

    if (!currentPartial || !criteria || !currentPartial.selectedTrain || !currentPartial.passengers || currentPartial.passengers.length === 0) {
      return throwError(() => new Error('Incomplete reservation data.'));
    }

    const finalReservation: Reservation = {
      id: `res-${new Date().getTime()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: 'user-mock-id', // Simuler un ID utilisateur
      selectedTrain: currentPartial.selectedTrain,
      departureStation: currentPartial.departureStation!,
      arrivalStation: currentPartial.arrivalStation!,
      departureDateTime: currentPartial.departureDateTime!,
      arrivalDateTime: currentPartial.arrivalDateTime!,
      passengers: currentPartial.passengers,
      totalPrice: currentPartial.totalPrice || 0,
      passengerCount: criteria.passengerCount,
      searchPassengerCategory: criteria.passengerCategory,
      status: 'pending', // Initialement en attente, passe à 'paid' après paiement
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Simuler la sauvegarde
    this.MOCK_RESERVATIONS.push(finalReservation);
    console.log('Reservation submitted: ', finalReservation);
    this.currentReservationState.next(null); // Réinitialiser l'état après la soumission
    this.searchCriteriaState.next(null); // Réinitialiser les critères

    return of(finalReservation).pipe(
      tap(res => console.log('Reservation successful:', res))
    );
  }

  getReservationById(id: string): Observable<Reservation | undefined> {
    return of(this.MOCK_RESERVATIONS.find(r => r.id === id));
  }

  // Méthode pour permettre la navigation vers l'étape précédente
  // On pourrait sauvegarder l'état dans le localStorage ou un autre BehaviorSubject si on veut une persistance plus forte
  // Pour l'instant, currentReservationState et searchCriteriaState devraient suffire pour la navigation interne.

  generatePassengerId(): string {
    // Génère un ID simple et unique pour un passager (pour cet exemple)
    return `pass-${new Date().getTime()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  updateReservationStatus(reservationId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'paid'): Observable<boolean> {
    const currentRes = this.getCurrentReservationState();
    if (currentRes && currentRes.id === reservationId) {
      this.updatePartialReservation({ status: status, updatedAt: new Date() });
      // In a real app, you would also save this to a backend.
      // For now, we update the BehaviorSubject and localStorage.
      if (this.isBrowser) {
        localStorage.setItem('currentReservation', JSON.stringify(this.currentReservationState.getValue()));
      }
      // Simulate a successful update
      return of(true);
    } else {
      // If the reservation is not the current one, or not found, search in MOCK_RESERVATIONS (if used)
      // This part might need more robust handling if you have a list of reservations managed by the service
      const reservationInMock = this.MOCK_RESERVATIONS.find(r => r.id === reservationId);
      if (reservationInMock) {
        reservationInMock.status = status;
        reservationInMock.updatedAt = new Date();
        // Again, persist to backend if this were a real app.
        return of(true);
      }
      return of(false); // Indicate reservation not found or not updated
    }
  }

  // Méthode pour nettoyer les données de réservation
  clearReservation(): void {
    this.currentReservationState.next(null);
    this.searchCriteriaState.next(null);

    if (this.isBrowser) {
      localStorage.removeItem('currentReservation');
      localStorage.removeItem('searchCriteria');
    }

    console.log('🧹 Données de réservation nettoyées');
  }
}
