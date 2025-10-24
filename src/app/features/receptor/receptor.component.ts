import { Component, HostListener } from '@angular/core';
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
import { TablaMaestra } from '../../models/maestros/tablaMaestra.model';

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
  isDesktop = window.innerWidth > 992; // breakpoint como Bootstrap lg

  @HostListener('window:resize') //Escucha eventos del navegador
  onResize() {
    this.isDesktop = window.innerWidth > 992;
  }

  registroForm: FormGroup;

  existsPerson: boolean = false;
  clickedSearch: boolean = false;
  personFound: boolean = false;

  typeDocumentOptions: TablaMaestra[] = [
    { idTablaMaestra: 1, codigo: '001001', denominacion: 'DNI' },
    {
      idTablaMaestra: 2,
      codigo: '001002',
      denominacion: 'Cédula de Extranjería (CE)',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacientesService: PacientesService,
    private personaService: PersonaService
  ) {
    this.registroForm = this.fb.group({
      tipo_doc: ['', Validators.required],
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
      const name = this.capitalize(form.nombres);
      const apellidoPaterno = this.capitalize(form.apellido_paterno);
      const apellidoMaterno = this.capitalize(form.apellido_materno);
      const documentType = form.tipo_doc;
      const numeroDocumento = form.num_doc;

      if (this.personFound) {
        //Register cita
        // Agregar paciente al servicio
        this.pacientesService.agregarPaciente(
          name + ' ' + apellidoPaterno + ' ' + apellidoMaterno,
          numeroDocumento
        );
      } else {
        // Register person
        const newPerson: Persona = {
          personaId: 1, // Este valor será ignorado por el backend
          nombre: name,
          apellidoPaterno: apellidoPaterno,
          apellidoMaterno: apellidoMaterno,
          tipoDocumentoIdentidad: documentType,
          numeroDocumentoIdentidad: numeroDocumento,
          estado: 1,
        };

        this.personaService.savePerson(newPerson).subscribe({
          next: (response) => {
            const person: Persona = response.data;
            console.log('Persona registrada:', person);

            // Agregar paciente al servicio
            this.pacientesService.agregarPaciente(
              name + ' ' + apellidoPaterno + ' ' + apellidoMaterno,
              numeroDocumento
            );
          },
        });
      }
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
    if (this.registroForm.get('tipo_doc')?.value !== '001001') {
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
        const person: Persona = response.data;
        this.completeDataPerson(person);
        this.existsPerson = true;
        this.personFound = true;
      },
      error: (err) => {
        this.personaService.getDniInfo(dni).subscribe({
          next: (response) => {
            this.registroForm.patchValue({
              nombres: this.capitalize(response.first_name),
              apellido_paterno: this.capitalize(response.first_last_name),
              apellido_materno: this.capitalize(response.second_last_name),
            });
            this.existsPerson = true;
            this.personFound = false;
          },
          error: (err) => {
            this.notFoundPerson();
            this.existsPerson = false;
            this.personFound = false;
          },
        });
      },
    });
  }

  private completeDataPerson(persona: Persona) {
    this.registroForm.patchValue({
      nombres: this.capitalize(persona.nombre),
      apellido_paterno: this.capitalize(persona.apellidoPaterno),
      apellido_materno: this.capitalize(persona.apellidoMaterno),
    });
  }

  private resetForm() {
    this.registroForm.reset({
      tipo_doc: '',
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
    });
  }

  private capitalize(str: string | null | undefined): string {
    if (!str) return '';

    const cleanStr = String(str).trim();

    const lowerCaseStr = cleanStr.toLowerCase();

    return lowerCaseStr.replace(/(^|\s)([a-zñáéíóúü])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
  }
}
