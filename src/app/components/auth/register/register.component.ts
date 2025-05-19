import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  formSubmitted = false;
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
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      gender: ['', Validators.required],
      residence: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      nationality: ['', Validators.required],
    });
  }

  passwordStrengthValidator(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null;
    }

    // Vérifier si le mot de passe contient au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;

    return !passwordValid ? { weakPassword: true } : null;
  }

  // Méthode ajoutée pour vérifier les caractères spéciaux de manière sécurisée dans le template
  hasSpecialChar(value: string): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
  }

  // Helper methods for template regex
  hasUpperCase(value: string): boolean {
    return /[A-Z]/.test(value);
  }

  hasLowerCase(value: string): boolean {
    return /[a-z]/.test(value);
  }

  hasDigit(value: string): boolean {
    return /\d/.test(value);
  }

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit(): void {
    this.formSubmitted = true;

    // Si le formulaire n'est pas valide, sortir de la fonction
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (user) => {
        this.isSubmitting = false;
        // Redirection vers la page de recherche après inscription réussie
        this.router.navigate(['/search']);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Erreur lors de l\'inscription:', error);
      }
    });
  }
}
