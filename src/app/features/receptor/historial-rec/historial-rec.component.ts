import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { UsuarioService } from '../../../services/seguridad/usuario.service';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import { OrdenAtencion } from '../../../models/turnos/ordenatencion.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalerrorComponent } from '../../../components/modalerror/modalerror.component';
import { ViewStatusOrderAtentionPipe } from '../../../pipes/view-status-order-atention.pipe';
import { Usuario } from '../../../models/seguridad/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-historial-rec',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ViewStatusOrderAtentionPipe
  ],
  templateUrl: './historial-rec.component.html',
  styleUrl: './historial-rec.component.css',
})
export class HistorialRecComponent implements OnInit {
  columnas: string[] = [
    'index',
    'paciente',
    'numeroDocumento',
    'turno',
    'estado',
  ];

  today: Date = new Date();
  form: FormGroup;

  userCurrent?: Usuario | null;

  orderAtentionList: OrdenAtencion[] = [];

  loadList: boolean = false;

  dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private orderAtentionService: OrdenatencionService,
    private router : Router
  ) {
    this.form = this.fb.group({
      fechaEng: [null as Date | null], // Para el datepicker
      fecha: [''], // Para mostrar DD/MM/YYYY
      diaSemana: [null], // Día de la semana
    });
  }

  ngOnInit(): void {
    const date = this.formatOrdenFecha(this.today);

    this.userCurrent = this.usuarioService.getUserLoggedIn();
    if (
      this.userCurrent === null ||
      this.userCurrent === undefined ||
      this.userCurrent.rol.denominacion === 'Asesor' ||
      this.userCurrent.rol.denominacion === 'Administrador'
    ) {
      this.router.navigate(['/sig-in']);
    }

    if (this.userCurrent?.rol.denominacion === 'Administrador') {
      this.loadList = true;
      this.orderAtentionService
        .getLisByDateAndReceptor(date, this.userCurrent.usuarioId)
        .subscribe({
          next: (response) => {
            this.orderAtentionList = response.data;
            this.loadList = false;
          },
          error: (error) => {
            this.openModalError(error);
            this.loadList = false;
          },
        });
    }
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
}
