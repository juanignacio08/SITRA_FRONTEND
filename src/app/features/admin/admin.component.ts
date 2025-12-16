import { CommonModule } from '@angular/common';
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/seguridad/usuario.service';
import { Usuario } from '../../models/seguridad/usuario.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  isDesktop = window.innerWidth > 992; // breakpoint como Bootstrap lg

  user?: Usuario | null;

  @HostListener('window:resize') //Escucha eventos del navegador
  onResize() {
    this.isDesktop = window.innerWidth > 992;
  }

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.user = this.usuarioService.getUserLoggedIn();
    if (
      this.user === null ||
      this.user === undefined ||
      this.user.rol.denominacion !== 'Administrador'
    ) {
      this.router.navigate(['/sig-in']);
    }
  }

  verPerfil() {
    console.log('Ver perfil');
    // Aquí puedes navegar, por ejemplo:
    // this.router.navigate(['/perfil']);
  }

  cerrarSesion() {
    console.log('Cerrar sesión');
    this.usuarioService.logout();
    this.router.navigate(['/sig-in']);
  }
}
