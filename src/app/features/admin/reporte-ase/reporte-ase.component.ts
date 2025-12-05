import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reporte-ase',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './reporte-ase.component.html',
  styleUrl: './reporte-ase.component.css'
})
export class ReporteAseComponent {
  columnas: string[] = ['ordenAtencion', 'nombre', 'numeroDocumento', 'horaInicio', 'horaFin','llamadas', 'ventanilla', 'estado'];

  // Ya no hace falta el arreglo local
  // historial: PacienteHistorial[] = [...];
}
