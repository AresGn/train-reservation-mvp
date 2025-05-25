export interface Passenger {
    firstName: string;
    lastName: string;
    age: number;
    status: 'standard' | 'student' | 'senior';
    ticketType: 'standard' | 'business' | 'first';
    emergencyContact: string;
    price?: number;
}

export interface PassengerFormData extends Passenger {
    isValid?: boolean;
} 