import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SearchComponent } from './components/reservation/search/search.component';
import { SelectTrainComponent } from './components/reservation/select-train/select-train.component';
import { PassengerDetailsComponent } from './components/reservation/passenger-details/passenger-details.component';
import { PaymentComponent } from './components/reservation/payment/payment.component';
import { ConfirmationComponent } from './components/reservation/confirmation/confirmation.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  { path: 'select-train', component: SelectTrainComponent },
  { path: 'passenger-details', component: PassengerDetailsComponent, title: 'Détails des Passagers' },
  { path: 'payment', component: PaymentComponent, title: 'Paiement' },
  { path: 'confirmation', component: ConfirmationComponent, title: 'Confirmation' },
  // D'autres routes seront ajoutées progressivement
];
