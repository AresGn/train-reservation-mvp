import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, switchMap } from 'rxjs/operators';
import { PaymentProcess, PaymentDetail } from '../models/payment.model';
import { Reservation } from '../models/reservation.model'; // Assuming this path
import { ReservationService } from './reservation.service'; // Assuming this path

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private reservationService: ReservationService) { }

  // Simulate processing payment
  processPayment(reservation: Reservation, paymentDetail: PaymentDetail): Observable<PaymentProcess> {
    // For a real application, this would involve:
    // 1. Sending payment details to a secure backend.
    // 2. Backend communicates with the payment gateway (Airtel, Moov, Orange APIs).
    // 3. Backend receives response and updates payment status.

    console.log('Processing payment for reservation:', reservation.id, 'with method:', paymentDetail.paymentMethod);

    // Simulate API call delay
    return of(null).pipe(
      delay(2000), // Simulate network latency
      tap(() => console.log('Payment simulation delay complete')),
      switchMap(() => {
        // Simulate different outcomes based on payment method or for testing
        const isSuccess = Math.random() > 0.1; // 90% success rate for simulation

        let paymentProcess: PaymentProcess = {
          reservationId: reservation.id,
          amount: reservation.totalPrice,
          currency: 'XAF', // Assuming XAF
          paymentDetail: paymentDetail,
          status: isSuccess ? 'success' : 'failed',
          timestamp: new Date(),
          transactionId: isSuccess ? `txn_${Date.now()}` : undefined,
          errorMessage: isSuccess ? undefined : 'Le paiement a échoué. Veuillez réessayer.'
        };

        if (isSuccess) {
          console.log('Payment successful:', paymentProcess);
          // Update reservation status in ReservationService
          this.reservationService.updateReservationStatus(reservation.id, 'paid').subscribe();
          return of(paymentProcess);
        } else {
          console.error('Payment failed:', paymentProcess);
          return throwError(() => paymentProcess); // Emit the failed payment process object
        }
      })
    );
  }
}
