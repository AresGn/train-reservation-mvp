export interface Train {
  id: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDate: Date;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  trainType: string;
  basePrice: number;
  availableSeats: number;
  features: string[];
}

export interface Station {
  id: string;
  name: string;
  city: string;
  isMainStation: boolean;
}

// Liste des gares du réseau ferroviaire gabonais
export const GABON_STATIONS: Station[] = [
  // Gares principales
  { id: 'owendo', name: 'Owendo', city: 'Libreville', isMainStation: true },
  { id: 'ndjole', name: 'Ndjolé', city: 'Ndjolé', isMainStation: true },
  { id: 'lope', name: 'Lopé', city: 'Lopé', isMainStation: true },
  { id: 'booue', name: 'Booué', city: 'Booué', isMainStation: true },
  { id: 'lastourville', name: 'Lastourville', city: 'Lastourville', isMainStation: true },
  { id: 'moanda', name: 'Moanda', city: 'Moanda', isMainStation: true },
  { id: 'franceville', name: 'Franceville', city: 'Franceville', isMainStation: true },
  
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