import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';
import { PacientesService } from '../../shared/pacientes.service';
import { Usuario } from '../../models/seguridad/usuario.model';
import { UsuarioService } from '../../services/seguridad/usuario.service';
interface Paciente {
  ordenAtencion: string;
  nombre: string;
  numeroDocumento: string;
  estado: string;
  llamando: boolean;
  horaInicio?: string;
  horaFin?: string;
  ventanilla?: string;
}

@Component({
  selector: 'app-asesor',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './asesor.component.html',
  styleUrls: ['./asesor.component.css']
})
export class AsesorComponent implements OnInit {
  isDesktop = window.innerWidth > 992; // breakpoint como Bootstrap lg

  userCurrent?: Usuario | null;

  @HostListener('window:resize') //Escucha eventos del navegador
  onResize() {
    this.isDesktop = window.innerWidth > 992;
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isFullScreen = false;

  constructor(private router: Router,
    public usuarioService: UsuarioService) { }
  
  ngOnInit(): void {
    this.userCurrent = this.usuarioService.getUserLoggedIn();
    if (
      this.userCurrent === null ||
      this.userCurrent === undefined ||
      this.userCurrent.rol.denominacion === 'Receptor' ||
      this.userCurrent.rol.denominacion === 'Administrador'
    ) {
      this.router.navigate(['/sig-in']);
    }
  }

  verPerfil() {
    console.log('Ver perfil');
  }

  cerrarSesion() {
    this.usuarioService.logout();
    this.router.navigate(['/sig-in']);
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      this.isFullScreen = true;
    } else {
      document.exitFullscreen();
      this.isFullScreen = false;
    }
  }

}
