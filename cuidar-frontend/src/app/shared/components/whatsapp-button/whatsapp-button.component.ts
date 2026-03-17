import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  templateUrl: './whatsapp-button.component.html',
  styleUrl: './whatsapp-button.component.css'
})
export class WhatsappButtonComponent {
  // Formato WhatsApp Argentina: 549 + codigo de area + numero (sin +, sin 0 y sin 15)
  @Input() phoneNumber: string = '5493518066297';
  @Input() message: string = 'Hola, necesito asistencia urgente de CuidAR';

  get whatsappUrl(): string {
    const cleanPhone = this.phoneNumber.replace(/[^\d]/g, '');
    const encodedMessage = encodeURIComponent(this.message);
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
}
