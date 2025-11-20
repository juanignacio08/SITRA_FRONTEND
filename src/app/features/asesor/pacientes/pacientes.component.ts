import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PacientesService } from '../../../shared/pacientes.service';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import {
  OrdenAtencion,
  OrdenAtencionRequest,
} from '../../../models/turnos/ordenatencion.model';
import {
  TablaMaestraEstadosOrdenAtencion,
  TablaMaestraPrioridades,
  TablaMaestraVentanillas,
} from '../../../models/maestros/tablaMaestra.model';
import { A11yModule } from '@angular/cdk/a11y';

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
    A11yModule,
  ],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  columnas: string[] = ['turno', 'nombre', 'numeroDocumento', 'llamadas'];

  orderAtentionList: OrdenAtencion[] = [];
  orderAtentionInCall?: OrdenAtencion;
  namePacienteInCall: string = '';

  asesorId = 3; // ID del asesor (ejemplo estático)

  currentUtterance: SpeechSynthesisUtterance | null = null;

  orderAtentionService = inject(OrdenatencionService);
  pacientesService = inject(PacientesService);

  ngOnInit(): void {
    this.getOrderAtentionInCall();
    this.getOrdersAtentionNormal();
  }

  getDateFormatted(date: Date): string {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return fechaFormateada;
  }

  getOrdersAtentionNormal() {
    const fechaFormateada = this.getDateFormatted(new Date());

    this.orderAtentionService
      .getNormalPaginatedOrders(0, 10, fechaFormateada)
      .subscribe({
        next: (response) => {
          console.log('Órdenes de atención normales obtenidas:', response.data);
          this.orderAtentionList = response.data;
        },
      });
  }

  getOrderAtentionInCall() {
    const fechaFormateada = this.getDateFormatted(new Date());

    this.orderAtentionService
      .getOrderAtentionInCallByVentanilla(
        fechaFormateada,
        TablaMaestraVentanillas.VENTANILLA_1
      )
      .subscribe({
        next: (response) => {
          this.orderAtentionInCall = response.data;
        },
        error: (error) => {
          console.error(
            'Error al obtener la siguiente orden de atención:',
            error
          );
          this.orderAtentionInCall = undefined;
        },
      });
  }

  callPacient() {
    const fechaFormateada = this.getDateFormatted(new Date());

    this.orderAtentionService
      .getNextOrderAtention(
        fechaFormateada,
        TablaMaestraPrioridades.NORMAL,
        TablaMaestraVentanillas.VENTANILLA_1,
        this.asesorId
      )
      .subscribe({
        next: (response) => {
          this.orderAtentionInCall = response.data;

          this.namePacienteInCall = `${response.data.persona.nombre} ${response.data.persona.apellidoPaterno} ${response.data.persona.apellidoMaterno}`;

          this.llamarTurno();
          this.getOrdersAtentionNormal();
        },
        error: () => {
          this.orderAtentionInCall = undefined;
          this.namePacienteInCall = '';
        },
        complete: () => {
          // 👇 Aquí recursión controlada: espera 10s y vuelves a ejecutar
          setTimeout(() => this.callPacient(), 10000);
        },
      });
  }

  llamarTurno() {
    const texto =
      'Turno de ' + this.namePacienteInCall + ', acerquese a ventanilla 1.';

    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-ES'; // idioma español
    mensaje.rate = 0.75; // velocidad normal
    mensaje.pitch = 1; // tono normal

    // Opcional: elegir una voz específica si la conocés
    // const voces = speechSynthesis.getVoices();
    // mensaje.voice = voces.find(v => v.name.includes("Sabina"));

    window.speechSynthesis.speak(mensaje);
  }

  finalizar(paciente: Paciente) {
    this.pacientesService.finalizarPaciente(paciente);
  }

  // 🔹 Botón de ausente
  ausente(p: Paciente) {
    this.pacientesService.marcarAusente(p);
  }
}
