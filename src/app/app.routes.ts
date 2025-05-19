import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  // D'autres routes seront ajoutées progressivement
];
