import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SearchComponent } from './components/reservation/search/search.component';
import { SelectTrainComponent } from './components/reservation/select-train/select-train.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'search', component: SearchComponent },
  { path: 'select-train', component: SelectTrainComponent },
  // D'autres routes seront ajoutées progressivement
];
