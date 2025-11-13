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
  nextOrderAtention?: OrdenAtencion;
  orderAtentionInCall?: OrdenAtencion;

  asesorId = 3; // ID del asesor (ejemplo estático)

  currentUtterance: SpeechSynthesisUtterance | null = null;

  orderAtentionService = inject(OrdenatencionService);
  pacientesService = inject(PacientesService);

  ngOnInit(): void {
    this.getOrdersAtentionNormal();
  }

  getOrdersAtentionNormal() {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    this.orderAtentionService
      .getNormalPaginatedOrders(0, 10, fechaFormateada)
      .subscribe({
        next: (response) => {
          console.log('Órdenes de atención normales obtenidas:', response.data);
          this.orderAtentionList = response.data;
          this.nextOrderAtention = this.orderAtentionList[0];
        },
      });
  }

  callPacient() {
    if (this.orderAtentionInCall) {
      if (this.orderAtentionInCall.numLlamadas < 3) {
        const orderAtention: OrdenAtencionRequest = {
          ordenAtencionId: this.orderAtentionInCall.ordenAtencionId,
          personaId: this.orderAtentionInCall.persona.personaId,
          receptorId: this.orderAtentionInCall.receptor.usuarioId,
          asesorId: this.asesorId,
          codPrioridad: this.orderAtentionInCall
            .codPrioridad as TablaMaestraPrioridades,
          codEstadoAtencion:
            TablaMaestraEstadosOrdenAtencion.EN_LLAMADA as TablaMaestraEstadosOrdenAtencion,
          numLlamadas: this.orderAtentionInCall.numLlamadas + 1,
          estado: 1,
          codVentanilla: TablaMaestraVentanillas.VENTANILLA_1,
        };

        this.orderAtentionService.updateOrderAtention(orderAtention).subscribe({
          next: (response) => {
            console.log('Orden de atención actualizada:', response);
            this.orderAtentionInCall = response.data;
          },
          error: (error) => {
            console.error('Error al actualizar la orden de atención:', error);
          },
        });
      }
    } else if (this.nextOrderAtention) {
      const orderAtention: OrdenAtencionRequest = {
        ordenAtencionId: this.nextOrderAtention.ordenAtencionId,
        personaId: this.nextOrderAtention.persona.personaId,
        receptorId: this.nextOrderAtention.receptor.usuarioId,
        asesorId: this.asesorId,
        codPrioridad: this.nextOrderAtention
          .codPrioridad as TablaMaestraPrioridades,
        codEstadoAtencion:
          TablaMaestraEstadosOrdenAtencion.EN_LLAMADA as TablaMaestraEstadosOrdenAtencion,
        numLlamadas: this.nextOrderAtention.numLlamadas + 1,
        estado: 1,
        codVentanilla: TablaMaestraVentanillas.VENTANILLA_1,
      };

      this.orderAtentionService.updateOrderAtention(orderAtention).subscribe({
        next: (response) => {
          console.log('Orden de atención actualizada:', response);
          this.orderAtentionInCall = response.data;
          this.getOrdersAtentionNormal(); // Recargar la lista de órdenes de atención
        },
        error: (error) => {
          console.error('Error al actualizar la orden de atención:', error);
        },
      });
    }
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
