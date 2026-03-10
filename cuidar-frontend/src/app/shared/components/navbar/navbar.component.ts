import { Component, inject, OnInit } from '@angular/core';
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
export class NavbarComponent implements OnInit {
  private adminService = inject(AdminService);
  isAdminLoggedIn: boolean = false;

  async ngOnInit() {
    this.isAdminLoggedIn = await this.adminService.isLoggedIn();
  }

  logout(): void {
    this.adminService.logout().catch(err => console.error('Error al cerrar sesión:', err));
  }
}
