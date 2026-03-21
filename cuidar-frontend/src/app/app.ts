import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { WhatsappButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, WhatsappButtonComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private swUpdate = inject(SwUpdate);
  protected readonly title = signal('cuidar-frontend');

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates.subscribe(async (event) => {
      if (event.type !== 'VERSION_READY') {
        return;
      }

      await this.swUpdate.activateUpdate();
      window.location.reload();
    });

    void this.swUpdate.checkForUpdate();
  }
}
