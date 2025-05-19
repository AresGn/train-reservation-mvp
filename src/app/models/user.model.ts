export interface User {
  id?: string;
  email: string;
  password?: string; // Ne sera jamais envoyé dans les réponses
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  residence: string;
  age: number;
  nationality: string;
  createdAt?: Date;
  updatedAt?: Date;
} 