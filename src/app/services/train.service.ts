import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Train, Station, GABON_STATIONS, PassengerCategory } from '../models/train.model';

@Injectable({
  providedIn: 'root'
})
export class TrainService {
  // Données mockées pour simuler une API
  private mockTrains: Train[] = [
    {
      id: 'train-001',
      departureLocation: 'Owendo',
      arrivalLocation: 'Franceville',
      departureDate: new Date('2023-12-15'),
      departureTime: '08:00',
      arrivalTime: '18:00',
      duration: '10h00',
      trainType: 'Express',
      basePrice: 35000,
      availableSeats: 120,
      features: ['WiFi', 'Restauration', 'Climatisation']
    },
    {
      id: 'train-002',
      departureLocation: 'Owendo',
      arrivalLocation: 'Franceville',
      departureDate: new Date('2023-12-15'),
      departureTime: '14:30',
      arrivalTime: '01:30',
      duration: '11h00',
      trainType: 'Standard',
      basePrice: 30000,
      availableSeats: 150,
      features: ['Climatisation']
    },
    {
      id: 'train-003',
      departureLocation: 'Franceville',
      arrivalLocation: 'Owendo',
      departureDate: new Date('2023-12-16'),
      departureTime: '07:00',
      arrivalTime: '17:30',
      duration: '10h30',
      trainType: 'Express',
      basePrice: 35000,
      availableSeats: 100,
      features: ['WiFi', 'Restauration', 'Climatisation']
    },
    {
      id: 'train-004',
      departureLocation: 'Ndjolé',
      arrivalLocation: 'Lastourville',
      departureDate: new Date('2023-12-15'),
      departureTime: '09:15',
      arrivalTime: '15:45',
      duration: '6h30',
      trainType: 'Standard',
      basePrice: 20000,
      availableSeats: 80,
      features: ['Climatisation']
    },
    {
      id: 'train-005',
      departureLocation: 'Booué',
      arrivalLocation: 'Moanda',
      departureDate: new Date('2023-12-16'),
      departureTime: '10:00',
      arrivalTime: '14:30',
      duration: '4h30',
      trainType: 'Express',
      basePrice: 18000,
      availableSeats: 90,
      features: ['WiFi', 'Climatisation']
    }
  ];

  constructor() { }

  getAllStations(): Station[] {
    return GABON_STATIONS;
  }

  getMainStations(): Station[] {
    return GABON_STATIONS.filter(station => station.isMainStation);
  }

  searchTrains(
    departureLocation: string,
    arrivalLocation: string,
    departureDate: Date,
    passengerCount: number,
    passengerCategory: PassengerCategory
  ): Observable<Train[]> {
    // Simulation d'un appel API avec délai
    return of(this.filterTrains(departureLocation, arrivalLocation, departureDate)).pipe(
      delay(1000) // Simuler un délai réseau d'une seconde
    );
  }

  private filterTrains(departureLocation: string, arrivalLocation: string, departureDate: Date): Train[] {
    // Convertir la date reçue en format simple pour la comparaison (YYYY-MM-DD)
    const searchDate = departureDate.toISOString().split('T')[0];
    
    return this.mockTrains.filter(train => {
      // Comparaison de la date (ignorer l'heure)
      const trainDate = train.departureDate.toISOString().split('T')[0];
      
      return train.departureLocation === departureLocation &&
             train.arrivalLocation === arrivalLocation &&
             trainDate === searchDate;
    });
  }

  // Calculer le prix en fonction de la catégorie de passager
  calculatePrice(basePrice: number, category: PassengerCategory): number {
    switch (category) {
      case PassengerCategory.STUDENT:
        return basePrice * 0.7; // Réduction de 30%
      case PassengerCategory.SENIOR:
        return basePrice * 0.65; // Réduction de 35%
      default:
        return basePrice; // Prix standard
    }
  }
} 