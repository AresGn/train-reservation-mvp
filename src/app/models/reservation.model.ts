import { Train, PassengerCategory, Station } from './train.model';

export interface Passenger {
  id: string; // Peut être généré dynamiquement ou basé sur l'index
  name: string;
  age: number;
  passengerCategory: PassengerCategory; // La catégorie (étudiant, senior, etc.)
  seatPreference?: string; // Optionnel: ex: "fenêtre", "couloir"
  emergencyContact?: string; // Optionnel
  priceModifier?: number; // ex: 0.7 pour 30% de réduction
  price: number; // Prix calculé pour ce passager
}

export interface Reservation {
  id: string; // ID unique de la réservation
  userId?: string; // ID de l'utilisateur si connecté
  selectedTrain: Train;
  departureStation: Station; // Ajouté pour plus de clarté sur le billet
  arrivalStation: Station;   // Ajouté pour plus de clarté sur le billet
  departureDateTime: Date; // Combinaison de la date et de l'heure de départ du train sélectionné
  arrivalDateTime: Date;   // Combinaison de la date et de l'heure d'arrivée du train sélectionné
  passengers: Passenger[];
  totalPrice: number;
  passengerCount: number; // Nombre total de passagers depuis les critères de recherche
  searchPassengerCategory: PassengerCategory; // Catégorie générale de passagers de la recherche
  status: 'pending' | 'confirmed' | 'cancelled' | 'paid'; // Statut de la réservation
  createdAt: Date;
  updatedAt: Date;
}

// Optionnel: pour stocker l'état actuel de la construction d'une réservation
export interface PartialReservation {
  selectedTrain?: Train;
  departureStation?: Station;
  arrivalStation?: Station;
  departureDateTime?: Date;
  arrivalDateTime?: Date;
  passengerCount?: number;
  searchPassengerCategory?: PassengerCategory;
  passengers?: Passenger[];
  totalPrice?: number;
} 