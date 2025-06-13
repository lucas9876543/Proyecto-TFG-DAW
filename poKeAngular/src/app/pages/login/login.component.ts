import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  usernameOrEmail = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const credentials = {
      email: this.usernameOrEmail,
      password: this.password,
    };

    this.authService
      .login(credentials)
      .pipe(
        tap((_) => this.router.navigate(['/'])),
        catchError((error) => {
          this.errorMessage =
            'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          return of(null);
        })
      )
      .subscribe();
  }
}
