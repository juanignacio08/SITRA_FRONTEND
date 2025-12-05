import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reporte-rec',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './reporte-rec.component.html',
  styleUrl: './reporte-rec.component.css'
})
export class ReporteRecComponent {
    columnas: string[] = ['ordenAtencion', 'nombre', 'numeroDocumento', 'horaInicio', 'horaFin', 'estado'];

  // Ya no hace falta el arreglo local
  // historial: PacienteHistorial[] = [...];
}
