export interface PaymentDetail {
  paymentMethod: 'airtel' | 'moov' | 'orange' | 'card'; // Focusing on mobile money as requested
  phoneNumber?: string; // For mobile money
  // Card details can be added later if needed for 'card' paymentMethod
  // cardNumber?: string;
  // cardExpiry?: string;
  // cardCvc?: string;
}

export interface PaymentProcess {
  reservationId: string;
  amount: number;
  currency: string; // e.g., 'XAF'
  paymentDetail: PaymentDetail;
  status: 'pending' | 'success' | 'failed';
  transactionId?: string;
  timestamp: Date;
  errorMessage?: string;
} 