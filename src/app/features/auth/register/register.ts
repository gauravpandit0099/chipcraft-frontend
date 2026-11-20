import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { ToasterService } from '../../../core/services/toaster';
import { RegisterPayload } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private auth = inject(AuthService);
  private toaster = inject(ToasterService);
  form: RegisterPayload = { name: '', email: '', password: '', phone: '', address: '' };
  loading = false;

  /* submit registration form */
  onSubmit(): void {
    try {
      if (!this.form.name || !this.form.email || this.form.password.length < 6) {
        this.toaster.error('Enter name, email, and 6+ char password');
        return;
      }
      this.loading = true;
      this.auth.register(this.form).subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    } catch {
      this.loading = false;
      this.toaster.error('Unable to submit registration');
    }
  }
}
