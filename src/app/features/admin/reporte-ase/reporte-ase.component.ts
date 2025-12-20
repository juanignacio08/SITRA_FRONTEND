import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { OrdenATencionProjection } from '../../../models/turnos/ordenatencion.model';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import { ViewStatusOrderAtentionPipe } from '../../../pipes/view-status-order-atention.pipe';
import { ViewVentanillaPipe } from '../../../pipes/view-ventanilla.pipe';
import { MatDialog } from '@angular/material/dialog';
import { UsuarioService } from '../../../services/seguridad/usuario.service';
import { ModalerrorComponent } from '../../../components/modalerror/modalerror.component';
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
  selector: 'app-reporte-ase',
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
    ViewVentanillaPipe,
  ],
  templateUrl: './reporte-ase.component.html',
  styleUrls: ['./reporte-ase.component.css'],
})
export class ReporteAseComponent implements OnInit {
  columnas: string[] = [
    'ordenAtencion',
    'nombre',
    'numeroDocumento',
    'horaLlamada',
    'llamadas',
    'horaInicio',
    'horaFin',
    'ventanilla',
    'estado',
  ];

  today: Date = new Date();
  form: FormGroup;

  orderAtentionList: OrdenATencionProjection[] = [];
  /* para la busqueda */
  orderAtentionListOriginal: OrdenATencionProjection[] = [];


  loading: boolean = false;

  user?: Usuario | null;

  dialog = inject(MatDialog);
  orderAtentionService = inject(OrdenatencionService);

  constructor(
    private fb: FormBuilder,
    private dateAdapter: DateAdapter<Date>,
    private usuarioService: UsuarioService,
    private route: Router
  ) {
    // Forzar locale a español
    this.dateAdapter.setLocale('es-PE');

    // Inicializar formulario
    this.form = this.fb.group({
      fechaEng: [this.today], // Para el datepicker
      fecha: [''], // Para mosull as Date trar DD/MM/YYYY
      diaSemana: [null], // Día de la semana
      dni: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.user = this.usuarioService.getUserLoggedIn();
    if (
      this.user === null ||
      this.user === undefined ||
      this.user.rol.denominacion !== 'Administrador'
    ) {
      this.route.navigate(['/sig-in']);
    } else {
      const fechaHoy = this.today;
      const fechaFormateada = this.formatOrdenFecha(fechaHoy);

      // 🔹 Sincronizar formulario
      this.form.patchValue({
        fechaEng: fechaHoy,
        fecha: fechaFormateada,
        diaSemana: fechaHoy.getDay(),
      });

      // 🔹 Cargar registros de HOY
      this.getRecordsByDate(fechaFormateada);
    }
    this.form.get('dni')?.valueChanges.subscribe(dni => {
      this.filtrarPorDni(dni);
    });

  }

  getRecordsByDate(date: string) {
    this.loading = true;
    this.orderAtentionService.getRecordByDate(date).subscribe({
      next: (response) => {
        this.orderAtentionList = response.data;
        this.orderAtentionListOriginal = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.openModalError(error);
        this.loading = false;
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

    this.getRecordsByDate(fechaFormateada);
  }
  soloNumeros(event: any) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
    this.form.get('dni')?.setValue(event.target.value);
  }
  filtrarPorDni(dni: string) {

  if (!dni || dni.length === 0) {
    this.orderAtentionList = this.orderAtentionListOriginal;
    return;
  }

  this.orderAtentionList = this.orderAtentionListOriginal.filter(p =>
    p.numerodocumentoidentidad
      ?.toString()
      .includes(dni)
  );
}


}
