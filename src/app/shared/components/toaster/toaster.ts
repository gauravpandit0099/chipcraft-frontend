import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from '../../../core/services/toaster';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.html',
  styleUrl: './toaster.css'
})
export class Toaster {
  /* inject toaster service */
  toaster = inject(ToasterService);
}
