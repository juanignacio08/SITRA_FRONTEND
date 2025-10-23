import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PacientesService } from '../../../shared/pacientes.service';

interface Paciente {
  ordenAtencion: string;
  nombre: string;
  numeroDocumento: string;
  llamadas: number;
  estado: string;
  llamando: boolean;
  horaInicio?: string;
  horaFin?: string;
}

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {
  historial: Paciente[] = [];
  constructor(public pacientesService: PacientesService) {}
  columnas: string[] = ['ordenAtencion', 'nombre', 'numeroDocumento', 'accion','estado', 'llamadas' ];

  /* pacientes: Paciente[] = [
    { ordenAtencion: '1', nombre: 'Ana García', numeroDocumento: '70569696', llamadas: '1', estado: 'Pendiente', llamando: false },
    { ordenAtencion: '2', nombre: 'Luis Pérez', numeroDocumento: '80569696', llamadas: '1', estado: 'Pendiente', llamando: false },
    { ordenAtencion: '3', nombre: 'María López', numeroDocumento: '10569696', llamadas: '1', estado: 'Pendiente', llamando: false }
  ];
 */
  currentUtterance: SpeechSynthesisUtterance | null = null;

  llamar(p: Paciente) {
    this.pacientesService.llamarPaciente(p);
     // Síntesis de voz
    const msg = new SpeechSynthesisUtterance(`Paciente ${p.nombre}, pase por favor`);
    speechSynthesis.speak(msg);
    this.currentUtterance = msg;
  }

  finalizar(paciente: Paciente) {
  this.pacientesService.finalizarPaciente(paciente);
}
// 🔹 Botón de ausente
  ausente(p: Paciente) {
    this.pacientesService.marcarAusente(p);
  }


}
