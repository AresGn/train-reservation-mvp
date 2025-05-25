import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Train, Station, GABON_STATIONS, PassengerCategory } from '../models/train.model';

@Injectable({
  providedIn: 'root'
})
export class TrainService {

  constructor() { }

  // Méthode pour générer des trains dynamiques basés sur la date de recherche
  private generateMockTrains(searchDate: Date): Train[] {
    const today = new Date();
    const searchDateCopy = new Date(searchDate);

    // Si la date de recherche est dans le passé, utiliser aujourd'hui
    if (searchDateCopy < today) {
      searchDateCopy.setTime(today.getTime());
    }

    const nextDay = new Date(searchDateCopy);
    nextDay.setDate(nextDay.getDate() + 1);

    return [
      // Trains pour le jour de recherche
      {
        id: 'train-001',
        departureLocation: 'Owendo',
        arrivalLocation: 'Franceville',
        departureDate: new Date(searchDateCopy),
        departureTime: '08:00',
        arrivalTime: '18:00',
        duration: '10h00',
        trainType: 'Express',
        basePrice: 45000,
        availableSeats: 120,
        features: ['WiFi', 'Restauration', 'Climatisation', 'Siège inclinable']
      },
      {
        id: 'train-002',
        departureLocation: 'Owendo',
        arrivalLocation: 'Franceville',
        departureDate: new Date(searchDateCopy),
        departureTime: '10:30',
        arrivalTime: '21:00',
        duration: '10h30',
        trainType: 'Standard',
        basePrice: 30000,
        availableSeats: 150,
        features: ['Climatisation', 'Snack Bar']
      },
      {
        id: 'train-006',
        departureLocation: 'Owendo',
        arrivalLocation: 'Franceville',
        departureDate: new Date(searchDateCopy),
        departureTime: '13:00',
        arrivalTime: '22:00',
        duration: '9h00',
        trainType: 'Premium',
        basePrice: 60000,
        availableSeats: 80,
        features: ['WiFi Premium', 'Repas inclus', 'Siège large', 'Priorité Embarquement']
      },
      {
        id: 'train-007',
        departureLocation: 'Owendo',
        arrivalLocation: 'Franceville',
        departureDate: new Date(searchDateCopy),
        departureTime: '16:00',
        arrivalTime: '03:00',
        duration: '11h00',
        trainType: 'Eco',
        basePrice: 25000,
        availableSeats: 200,
        features: ['Climatisation basique']
      },
      {
        id: 'train-004',
        departureLocation: 'Ndjolé',
        arrivalLocation: 'Lastourville',
        departureDate: new Date(searchDateCopy),
        departureTime: '09:15',
        arrivalTime: '15:45',
        duration: '6h30',
        trainType: 'Standard',
        basePrice: 20000,
        availableSeats: 80,
        features: ['Climatisation']
      },
      {
        id: 'train-008',
        departureLocation: 'Booué',
        arrivalLocation: 'Moanda',
        departureDate: new Date(searchDateCopy),
        departureTime: '10:00',
        arrivalTime: '14:30',
        duration: '4h30',
        trainType: 'Express',
        basePrice: 18000,
        availableSeats: 90,
        features: ['WiFi', 'Climatisation']
      },
      // Trains pour le jour suivant
      {
        id: 'train-003',
        departureLocation: 'Franceville',
        arrivalLocation: 'Owendo',
        departureDate: new Date(nextDay),
        departureTime: '07:00',
        arrivalTime: '17:30',
        duration: '10h30',
        trainType: 'Express',
        basePrice: 35000,
        availableSeats: 100,
        features: ['WiFi', 'Restauration', 'Climatisation']
      },
      {
        id: 'train-005',
        departureLocation: 'Booué',
        arrivalLocation: 'Moanda',
        departureDate: new Date(nextDay),
        departureTime: '10:00',
        arrivalTime: '14:30',
        duration: '4h30',
        trainType: 'Express',
        basePrice: 18000,
        availableSeats: 90,
        features: ['WiFi', 'Climatisation']
      }
    ];
  }

  getAllStations(): Station[] {
    return GABON_STATIONS;
  }

  getStationByName(name: string): Station | undefined {
    return GABON_STATIONS.find(station => station.name.toLowerCase() === name.toLowerCase());
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
    const searchDateString = departureDate.toISOString().split('T')[0];
    console.log(`Filter criteria: Departure=${departureLocation}, Arrival=${arrivalLocation}, Date=${departureDate.toISOString()} (Formatted as ${searchDateString})`);

    // Générer les trains dynamiques basés sur la date de recherche
    const mockTrains = this.generateMockTrains(departureDate);

    return mockTrains.filter(train => {
      const trainDateString = train.departureDate.toISOString().split('T')[0];
      const match = train.departureLocation.toLowerCase() === departureLocation.toLowerCase() &&
                    train.arrivalLocation.toLowerCase() === arrivalLocation.toLowerCase() &&
                    trainDateString === searchDateString;

      // Log pour chaque train pour voir pourquoi il ne correspond pas
      if (!match) {
        console.log(
          `Train ID ${train.id} NO MATCH: ` +
          `DepLoc: ${train.departureLocation.toLowerCase()} vs ${departureLocation.toLowerCase()} (${train.departureLocation.toLowerCase() === departureLocation.toLowerCase()}), ` +
          `ArrLoc: ${train.arrivalLocation.toLowerCase()} vs ${arrivalLocation.toLowerCase()} (${train.arrivalLocation.toLowerCase() === arrivalLocation.toLowerCase()}), ` +
          `Date: ${trainDateString} vs ${searchDateString} (${trainDateString === searchDateString})`
        );
      } else {
        console.log(`Train ID ${train.id} MATCHED!`);
      }
      return match;
    });
  }

  combineDateAndTime(date: Date, timeString: string, durationToAddInMinutes?: number): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0); // Initialise l'heure, les minutes, secondes et millisecondes

    if (durationToAddInMinutes) {
      newDate.setMinutes(newDate.getMinutes() + durationToAddInMinutes);
    }
    return newDate;
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