import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // Limpiar mensaje de error previo
    this.errorMessage = '';

    // Validación de contraseñas
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Validaciones adicionales
    if (!this.email || !this.username || !this.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.isLoading = true;

    const userData = {
      username: this.username,
      password: this.password,
      email: this.email,
    };

    this.authService
      .register(userData)
      .pipe(
        tap((response) => {
          console.log('Registro exitoso:', response);
          this.router.navigate(['/']);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error en registro:', error);

          // Manejo específico de errores
          if (error.status === 400) {
            if (typeof error.error === 'string') {
              this.errorMessage = error.error;
            } else if (error.error?.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage =
                'Datos inválidos. Verifica la información ingresada.';
            }
          } else if (error.status === 409) {
            this.errorMessage = 'El email ya está registrado';
          } else if (error.status === 0) {
            this.errorMessage =
              'No se puede conectar al servidor. Verifica tu conexión.';
          } else if (error.status >= 500) {
            this.errorMessage =
              'Error interno del servidor. Intenta más tarde.';
          } else {
            this.errorMessage = `Error al registrar el usuario: ${error.status}`;
          }

          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe({
        complete: () => {
          this.isLoading = false;
        },
      });
  }
}
