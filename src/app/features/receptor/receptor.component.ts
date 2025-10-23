import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PacientesService } from '../../shared/pacientes.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-receptor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatMenuModule,
    MatListModule,
    MatSidenavModule
  ],

  templateUrl: './receptor.component.html',
  styleUrls: ['./receptor.component.css']
})
export class ReceptorComponent {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacientesService: PacientesService
  ) {
    this.registroForm = this.fb.group({
      tipo_doc: ['cc', Validators.required],
      num_doc: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
    });
  }

  // Método que se ejecuta al registrar la cita
  registrarCita() {
    if (this.registroForm.valid) {
      const form = this.registroForm.value;
      const nombreCompleto = `${form.nombres} ${form.apellidos}`;
      const numeroDocumento = form.num_doc;

      // Agregar paciente al servicio
      this.pacientesService.agregarPaciente(nombreCompleto, numeroDocumento);

      // Opcional: limpiar el formulario
      this.registroForm.reset({ tipo_doc: 'cc' });
    } else {
      console.warn('Formulario incompleto');
    }
  }

  verPerfil() { /* ... */ }
  cerrarSesion() { this.router.navigate(['/sig-in']); }
}
