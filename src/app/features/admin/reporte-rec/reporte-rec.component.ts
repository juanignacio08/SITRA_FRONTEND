import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

// Formatos personalizados para MatDatepicker
export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-reporte-rec',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './reporte-rec.component.html',
  styleUrls: ['./reporte-rec.component.css']
})
export class ReporteRecComponent {
  columnas: string[] = [
    'ordenAtencion', 'nombre', 'numeroDocumento',
    'horaInicio', 'horaFin', 'estado'
  ];

  today: Date = new Date();
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>
  ) {
    // Forzar locale a español
    this.dateAdapter.setLocale('es-PE');

    // Inicializar formulario
    this.form = this.fb.group({
      fechaEng: [null as Date | null], // Para el datepicker
      fecha: [''],                     // Para mostrar DD/MM/YYYY
      diaSemana: [null]                // Día de la semana
    });
  }

  // Convierte Date a DD/MM/YYYY
  formatOrdenFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  obtenerFechaFormateada(fecha: Date): void {
    if (!fecha) return;

    // Actualiza el control datepicker
    this.form.patchValue({ fechaEng: fecha });

    // Guardar fecha en DD/MM/YYYY
    const fechaFormateada = this.formatOrdenFecha(fecha);
    this.form.patchValue({ fecha: fechaFormateada });

    // Día de la semana (0 = domingo, 1 = lunes, ...)
    const diaSemana = fecha.getDay();
    this.form.patchValue({ diaSemana });

    // Guardar en localStorage
    localStorage.setItem('fechaRedDist', fechaFormateada);
    localStorage.setItem('diaSemanaRedDist', diaSemana.toString());
  }
}
