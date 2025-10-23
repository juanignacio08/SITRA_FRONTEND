import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Router } from '@angular/router';
import { PacientesService } from '../../shared/pacientes.service';
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
export class AsesorComponent {

  currentUtterance: SpeechSynthesisUtterance | null = null;

  pacientes: Paciente[] = [
    { ordenAtencion: '1', nombre: 'Ana García', numeroDocumento: '70569696', estado: 'Pendiente', llamando: false },
    { ordenAtencion: '2', nombre: 'Luis Pérez', numeroDocumento: '80569696', estado: 'Pendiente', llamando: false },
    { ordenAtencion: '3', nombre: 'María López', numeroDocumento: '10569696', estado: 'Pendiente', llamando: false },
  ];

  historial: Paciente[] = [
    { ordenAtencion: '1', nombre: 'Carlos Ramírez', numeroDocumento: '50123456', horaInicio: '09:00:00', horaFin: '09:15:00', ventanilla: '1', estado: 'Completado', llamando: false },
    { ordenAtencion: '2', nombre: 'Elena Ruiz', numeroDocumento: '60123456', horaInicio: '09:20:00', horaFin: '09:35:00', ventanilla: '2', estado: 'Completado', llamando: false }
  ];


  @ViewChild('sidenav') sidenav!: MatSidenav;
  isFullScreen = false;

  constructor(private router: Router,public pacientesService: PacientesService) { }
  


  verPerfil() {
    console.log('Ver perfil');
  }

  cerrarSesion() {
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
