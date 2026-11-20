import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toaster } from './shared/components/toaster/toaster';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Toaster],
  templateUrl: './app.html',
})
export class App {
  // protected readonly title = signal('chipcraft-frontend');
}
