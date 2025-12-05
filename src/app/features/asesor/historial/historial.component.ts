import { CommonModule } from "@angular/common";
import { PacientesService } from "../../../shared/pacientes.service";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { Component, inject, OnInit } from "@angular/core";
import { OrdenatencionService } from "../../../services/turnos/ordenatencion.service";
import { OrdenATencionProjection } from "../../../models/turnos/ordenatencion.model";
import { ViewStatusOrderAtentionPipe } from "../../../pipes/view-status-order-atention.pipe";
import { ViewVentanillaPipe } from "../../../pipes/view-ventanilla.pipe";

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, ViewStatusOrderAtentionPipe, ViewVentanillaPipe],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  columnas: string[] = ['ordenAtencion', 'nombre', 'numeroDocumento', 'horaLlamada', 'llamadas', 'horaInicio', 'horaFin', 'ventanilla', 'estado'];

  orderAtentionList : OrdenATencionProjection[] = [];

  orderAtentionService = inject(OrdenatencionService);

  ngOnInit(): void {
    this.getRecordsByDate();
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

  getRecordsByDate() {
    const fechaFormateada = this.getDateFormatted(new Date());

    this.orderAtentionService
      .getRecordByDate(fechaFormateada)
      .subscribe({
        next: (response) => {
          console.log('Órdenes de atención obtenidas:', response.data);
          this.orderAtentionList = response.data;
        }
      });
  }

}
