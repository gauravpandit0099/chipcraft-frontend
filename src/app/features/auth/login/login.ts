import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToasterService } from '../../../core/services/toaster';
import { LoginPayload } from '../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private auth = inject(AuthService);
  private toaster = inject(ToasterService);
  form: LoginPayload = { email: '', password: '' };
  loading = false;

  /* submit login form */
  onSubmit(): void {
    try {
      if (!this.form.email || !this.form.password) {
        this.toaster.error('Email and password are required');
        return;
      }
      this.loading = true;
      this.auth.login(this.form).subscribe({
        next: () => { this.loading = false; },
        error: () => { this.loading = false; }
      });
    } catch {
      this.loading = false;
      this.toaster.error('Unable to submit login');
    }
  }

  /* fill demo credentials */
  fillDemo(role: 'admin' | 'user'): void {
    this.form = role === 'admin'
      ? { email: 'admin@chipcraft.com', password: 'admin123' }
      : { email: 'customer@chipcraft.com', password: 'user123' };
  }
}
