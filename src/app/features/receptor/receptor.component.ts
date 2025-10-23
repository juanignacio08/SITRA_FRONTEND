import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { PersonaService } from '../../services/seguridad/persona.service';
import { Persona } from '../../models/seguridad/persona.model';

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
    MatSidenavModule,
  ],

  templateUrl: './receptor.component.html',
  styleUrls: ['./receptor.component.css'],
})
export class ReceptorComponent {
  
  
  registroForm: FormGroup;

  existsPerson: boolean = false;
  clickedSearch: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacientesService: PacientesService,
    private personaService: PersonaService
  ) {
    this.registroForm = this.fb.group({
      tipo_doc: ['cc', Validators.required],
      num_doc: ['', Validators.required],
      nombres: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
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

  verPerfil() {
    /* ... */
  }
  cerrarSesion() {
    this.router.navigate(['/sig-in']);
  }

  searchPerson() {
    if (this.registroForm.get(('tipo_doc'))?.value !== 'dni') {
      return;
    }
    
    if (this.registroForm.get('num_doc')?.invalid) {
      console.warn('Número de documento inválido');
      return;
    }    

    this.clickedSearch = true;
    const dni = this.registroForm.get('num_doc')?.value;

    this.personaService.getPersonByDni(dni).subscribe({
      next: (response) => {
        const person : Persona = response.data;
        this.completeDataPerson(person);
        this.existsPerson = true;
      },
      error: (err) => {
        this.personaService.getDniInfo(dni).subscribe({
          next: (response) => {
            this.registroForm.patchValue({
              nombres: response.first_name,
              apellido_paterno: response.first_last_name,
              apellido_materno: response.second_last_name,
            });
            this.existsPerson = true;
          }, error: (err) => {
            this.notFoundPerson();
            this.existsPerson = false;
          }
        })
      },
    });
  }

  private completeDataPerson(persona: Persona) {
    this.registroForm.patchValue({
      nombres: persona.nombre,
      apellido_paterno: persona.apellidoPaterno,
      apellido_materno: persona.apellidoMaterno,
    });
  }

  private resetForm() {
    this.registroForm.reset({
      tipo_doc: 'cc',
      num_doc: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
    });
  }

  private notFoundPerson() {
    this.registroForm.patchValue({
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
    })
  }
}
