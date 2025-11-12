import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PacientesService } from '../../../shared/pacientes.service';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import { OrdenAtencion } from '../../../models/turnos/ordenatencion.model';

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
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  
  columnas: string[] = [
    'turno',
    'nombre',
    'numeroDocumento',
    'llamadas',
  ];

  orderAtentionList : OrdenAtencion[] = [];

  currentUtterance: SpeechSynthesisUtterance | null = null;

  orderAtentionService = inject(OrdenatencionService);
  pacientesService = inject(PacientesService);

  ngOnInit(): void {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    this.orderAtentionService.getNormalPaginatedOrders(0, 10, fechaFormateada).subscribe({
      next: (response) => {
        console.log('Órdenes de atención normales obtenidas:', response.data);
        this.orderAtentionList = response.data;
      }
    })
  }

  llamar(p: Paciente) {
    this.pacientesService.llamarPaciente(p);
    // Síntesis de voz
    const msg = new SpeechSynthesisUtterance(
      `Paciente ${p.nombre}, pase por favor`
    );
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
