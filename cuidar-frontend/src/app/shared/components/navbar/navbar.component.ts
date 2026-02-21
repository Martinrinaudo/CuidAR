import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private adminService = inject(AdminService);

  get isAdminLoggedIn(): boolean {
    return this.adminService.isLoggedIn();
  }

  logout(): void {
    this.adminService.logout();
  }
}
