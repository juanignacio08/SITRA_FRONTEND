import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { OrdenAtencion } from '../../../models/turnos/ordenatencion.model';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../../services/seguridad/usuario.service';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import { ModalerrorComponent } from '../../../components/modalerror/modalerror.component';
import { ViewStatusOrderAtentionPipe } from '../../../pipes/view-status-order-atention.pipe';
import { Usuario } from '../../../models/seguridad/usuario.model';
import { Router } from '@angular/router';

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
    ViewStatusOrderAtentionPipe,
  ],
  templateUrl: './reporte-rec.component.html',
  styleUrls: ['./reporte-rec.component.css'],
})
export class ReporteRecComponent implements OnInit {
  columnas: string[] = [
    'index',
    'paciente',
    'numeroDocumento',
    'turno',
    'hora',
    'estado',
  ];

  today: Date = new Date();
  form: FormGroup;

  user?: Usuario | null;

  orderAtentionList: OrdenAtencion[] = [];
  orderAtentionListOriginal: OrdenAtencion[] = [];

  loadList: boolean = false;

  dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private orderAtentionService: OrdenatencionService,
    private dateAdapter: DateAdapter<Date>,
    private router: Router
  ) {
    // Forzar locale a español
    this.dateAdapter.setLocale('es-PE');

    // Inicializar formulario
    this.form = this.fb.group({
      fechaEng: [this.today], // Para el datepicker
      fecha: [''], // Para mostrar DD/MM/YYYY
      diaSemana: [null], // Día de la semana
      dni: ['', [Validators.minLength(8)]],
    });

  }

  ngOnInit(): void {
    this.user = this.usuarioService.getUserLoggedIn();
    if (
      this.user === null ||
      this.user === undefined ||
      this.user.rol.denominacion !== 'Administrador'
    ) {
      this.router.navigate(['/sig-in']);
    } else {
      // 🔹 Fecha de hoy
      const fechaHoy = this.today;

      // 🔹 Inicializar formulario con HOY
      this.form.patchValue({
        fechaEng: fechaHoy,
        fecha: this.formatOrdenFecha(fechaHoy),
        diaSemana: fechaHoy.getDay(),
      });

      // 🔹 Cargar historial de HOY
      this.reloadOrderAtentions(this.formatOrdenFecha(fechaHoy));
    }
    this.form.get('dni')?.valueChanges.subscribe(dni => {
  this.filtrarPorDni(dni);
});

  }

  reloadOrderAtentions(date: string) {
    this.loadList = true;
    this.orderAtentionService.getLisByDate(date).subscribe({
      next: (response) => {
        this.orderAtentionList = response.data;
        this.orderAtentionListOriginal = response.data;
        this.loadList = false;
      },
      error: (error) => {
        this.openModalError(error);
        this.loadList = false;
      },
    });
  }

  openModalError(error: any) {
    const dialogRef = this.dialog.open(ModalerrorComponent, {
      width: '500px',
      data: error,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (!result) return;
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

    this.reloadOrderAtentions(fechaFormateada);
  }
  soloNumeros(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.form.get('dni')?.setValue(value, { emitEvent: false });
  }

  filtrarPorDni(dni: string) {
  if (!dni) {
    this.orderAtentionList = this.orderAtentionListOriginal;
    return;
  }

  this.orderAtentionList = this.orderAtentionListOriginal.filter(p =>
    p.persona?.numeroDocumentoIdentidad
      ?.toString()
      .includes(dni)
  );
}



}
