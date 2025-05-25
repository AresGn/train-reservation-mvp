export interface Train {
  id: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationInMinutes?: number;
  trainType: string;
  basePrice: number;
  availableSeats: number;
  features: string[];
}

export interface TrainSearchCriteria {
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  passengerCount: number;
  passengerCategory: PassengerCategory;
  // passengerCategory?: PassengerCategory; // Optionnel, si utilisé
}

export interface Station {
  id: string;
  name: string;
  city: string;
  isMainStation: boolean;
  latitude?: number;
  longitude?: number;
}

// Liste des gares du réseau ferroviaire gabonais
export const GABON_STATIONS: Station[] = [
  // Gares principales
  { id: 'owendo', name: 'Owendo', city: 'Libreville', isMainStation: true, latitude: 0.3017, longitude: 9.5372 },
  { id: 'ndjole', name: 'Ndjolé', city: 'Ndjolé', isMainStation: true, latitude: 0.1833, longitude: 10.7500 },
  { id: 'lope', name: 'Lopé', city: 'Lopé', isMainStation: true, latitude: -0.1983, longitude: 11.5689 },
  { id: 'booue', name: 'Booué', city: 'Booué', isMainStation: true, latitude: -0.0917, longitude: 11.9333 },
  { id: 'lastourville', name: 'Lastourville', city: 'Lastourville', isMainStation: true, latitude: -0.8333, longitude: 12.7500 },
  { id: 'moanda', name: 'Moanda', city: 'Moanda', isMainStation: true, latitude: -1.5667, longitude: 13.2000 },
  { id: 'franceville', name: 'Franceville', city: 'Franceville', isMainStation: true, latitude: -1.6333, longitude: 13.5833 },
  
  // Gares intermédiaires
  { id: 'ntoum', name: 'N\'toum', city: 'N\'toum', isMainStation: false },
  { id: 'andeme', name: 'Andeme', city: 'Andeme', isMainStation: false },
  { id: 'mbel', name: 'M\'Bel', city: 'M\'Bel', isMainStation: false },
  { id: 'oyan', name: 'Oyan', city: 'Oyan', isMainStation: false },
  { id: 'abanga', name: 'Abanga', city: 'Abanga', isMainStation: false },
  { id: 'alembe', name: 'Alembé', city: 'Alembé', isMainStation: false },
  { id: 'otoumbi', name: 'Otoumbi', city: 'Otoumbi', isMainStation: false },
  { id: 'bissouna', name: 'Bissouna', city: 'Bissouna', isMainStation: false },
  { id: 'ayem', name: 'Ayem', city: 'Ayem', isMainStation: false },
  { id: 'offoue', name: 'Offoué', city: 'Offoué', isMainStation: false },
  { id: 'ivindo', name: 'Ivindo', city: 'Ivindo', isMainStation: false },
  { id: 'mayabi', name: 'Mayabi', city: 'Mayabi', isMainStation: false },
  { id: 'milole', name: 'Milolé', city: 'Milolé', isMainStation: false },
  { id: 'doume', name: 'Doumé', city: 'Doumé', isMainStation: false },
  { id: 'lifouta', name: 'Lifouta', city: 'Lifouta', isMainStation: false },
  { id: 'mboungou', name: 'Mboungou-Mbadouma', city: 'Mboungou-Mbadouma', isMainStation: false }
];

// Types de passagers
export enum PassengerCategory {
  STANDARD = 'standard',
  STUDENT = 'student', // Réduction de 30%
  SENIOR = 'senior'    // Réduction de 35%
}

// Types de billets
export enum TicketType {
  STANDARD = 'standard',
  BUSINESS = 'business',
  FIRST_CLASS = 'firstClass'
} 