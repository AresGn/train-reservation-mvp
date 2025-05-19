import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  formSubmitted = false;
  loginError = false;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    this.loginError = false;

    // Si le formulaire n'est pas valide, sortir de la fonction
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (success) => {
        this.isSubmitting = false;
        if (success) {
          // Redirection intelligente : vers la page de recherche après connexion réussie
          this.router.navigate(['/search']);
        } else {
          this.loginError = true;
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.loginError = true;
        console.error('Erreur lors de la connexion:', error);
      }
    });
  }
}
