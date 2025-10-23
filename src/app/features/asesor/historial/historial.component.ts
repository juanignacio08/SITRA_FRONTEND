import { CommonModule } from "@angular/common";
import { PacientesService } from "../../../shared/pacientes.service";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { Component } from "@angular/core";

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent {
  columnas: string[] = ['ordenAtencion', 'nombre', 'numeroDocumento', 'horaInicio', 'horaFin','llamadas', 'ventanilla', 'estado'];

  // Ya no hace falta el arreglo local
  // historial: PacienteHistorial[] = [...];

  constructor(public pacientesService: PacientesService) {}
}
