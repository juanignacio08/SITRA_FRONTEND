import { Component, HostListener, OnInit } from '@angular/core';
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
import {
  TablaMaestraEstadosOrdenAtencion,
  TablaMaestraPrioridades,
  TablaMaestraTypeDocument,
} from '../../models/maestros/tablaMaestra.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OrdenatencionService } from '../../services/turnos/ordenatencion.service';
import {
  OrdenAtencion,
  OrdenAtencionRequest,
} from '../../models/turnos/ordenatencion.model';
import { TablaMaestra } from '../../models/maestros/tablaMaestra.model';
import { TablamaestraService } from '../../services/maestro/tablamaestra.service';

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
    MatSnackBarModule,
  ],

  templateUrl: './receptor.component.html',
  styleUrls: ['./receptor.component.css'],
})
export class ReceptorComponent implements OnInit {
  isDesktop = window.innerWidth > 992; // breakpoint como Bootstrap lg

  @HostListener('window:resize') //Escucha eventos del navegador
  onResize() {
    this.isDesktop = window.innerWidth > 992;
  }

  registroForm!: FormGroup;

  person?: Persona;
  usuarioId: number = 2;

  existsPerson: boolean = false;
  personFound: boolean = false;
  clickedSearch: boolean = false;

  typeDocumentOptions: TablaMaestra[] = [];

  public Prioridades = TablaMaestraPrioridades;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private pacientesService: PacientesService,
    private personaService: PersonaService,
    private ordenAtencionService: OrdenatencionService,
    private tablamaestraService: TablamaestraService,
    private snackBar: MatSnackBar
  ) {
    this.registroForm = this.fb.group({
      // Puedes usar valores nulos o vacíos temporales, pero deben coincidir con la estructura
      tipo_doc: [TablaMaestraTypeDocument.DNI],
      num_doc: [''],
      nombres: [''],
      apellido_paterno: [''],
      apellido_materno: [''],
    });
  }

  ngOnInit(): void {
    this.tablamaestraService
      .getItemsTable(this.tablamaestraService.codeTableDocumentType)
      .subscribe({
        next: (response) => {
          this.typeDocumentOptions = response.data;
          const firstOption =
            this.typeDocumentOptions.length > 0
              ? this.typeDocumentOptions[0].codigo
              : TablaMaestraTypeDocument.DNI;
          this.initForm(firstOption);
        },
        error: (err) => {
          this.initForm(TablaMaestraTypeDocument.DNI);
          console.error('Error al cargar los tipos de documento', err);
        },
      });
  }

  initForm(typeDocument: string) {
    this.registroForm = this.fb.group({
      // Usamos el valor determinado (el primer elemento cargado)
      tipo_doc: [typeDocument, Validators.required],
      num_doc: ['', Validators.required],
      nombres: ['', Validators.required],
      apellido_paterno: ['', Validators.required],
      apellido_materno: ['', Validators.required],
    });
  }

  // Método que se ejecuta al registrar la cita
  registrarCita(priority: TablaMaestraPrioridades) {
    if (this.registroForm.valid) {
      const form = this.registroForm.value;
      const name = this.capitalize(form.nombres);
      const apellidoPaterno = this.capitalize(form.apellido_paterno);
      const apellidoMaterno = this.capitalize(form.apellido_materno);
      const documentType = form.tipo_doc;
      const numeroDocumento = form.num_doc;

      if (this.personFound) {
        const orderAtencionRequest = this.createOrderAtentionRequest(
          1,
          this.person != undefined ? this.person.personaId : 0,
          this.usuarioId,
          priority,
          TablaMaestraEstadosOrdenAtencion.PENDIENTE,
          0,
          1
        );

        this.saveOrderAtention(orderAtencionRequest);

      } else {
        const newPerson: Persona = {
          personaId: 1,
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

            //Create Order Atention
            const orderAtencionRequest: OrdenAtencionRequest = {
              ordenAtencionId: 1,
              personaId: person.personaId,
              receptorId: this.usuarioId,
              codPrioridad: priority,
              codEstadoAtencion: TablaMaestraEstadosOrdenAtencion.PENDIENTE,
              numLlamadas: 0,
              estado: 1,
            };

            this.saveOrderAtention(orderAtencionRequest);
          },
          error: (err) => {
            this.messageSnackBar('Error al registrar persona ⚠️');
          },
        });
      }
    } else {
      this.messageSnackBar('Completa todos los campos obligatorios ⚠️');
    }
  }

  messageSnackBar(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  createOrderAtentionRequest(
    orderAtencionId: number,
    personaId: number,
    usuarioId: number,
    codPrioridad: TablaMaestraPrioridades,
    codEstadoAtencion: TablaMaestraEstadosOrdenAtencion,
    numLlamadas: number,
    estado: number
  ): OrdenAtencionRequest {
    const orderAtencionRequest: OrdenAtencionRequest = {
      ordenAtencionId: orderAtencionId,
      personaId: personaId,
      receptorId: usuarioId,
      codPrioridad: codPrioridad,
      codEstadoAtencion: codEstadoAtencion,
      numLlamadas: numLlamadas,
      estado: estado,
    };
    return orderAtencionRequest;
  }

  saveOrderAtention(orderAtencionRequest: OrdenAtencionRequest) {
    this.ordenAtencionService
      .saveOrderAtention(orderAtencionRequest)
      .subscribe({
        next: (response) => {
          const ordenAtencionResponse: OrdenAtencion = response.data;
          console.log(`Orden Atencion: `, ordenAtencionResponse);

          this.messageSnackBar(
            `Orden de Atención registrado con éxito. Turno: ${ordenAtencionResponse.turno} ✅`
          );

          this.resetAfterRegister(); // 🧹 Limpieza automática
        },
        error: (err) => {
          this.messageSnackBar('⚠️ Error al registrar el orden de atención');
          this.resetAfterRegister();
        },
      });
  }

  verPerfil() {
    /* ... */
  }
  cerrarSesion() {
    this.router.navigate(['/sig-in']);
  }

  searchPerson() {
    if (this.registroForm.get('tipo_doc')?.value !== TablaMaestraTypeDocument.DNI) {
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
        this.person = person;
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

  private resetAfterRegister() {
    this.registroForm.reset({
      tipo_doc: '001001', // Vuelve a seleccionar DNI por defecto
      num_doc: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
    });

    // Reinicia banderas de control
    this.existsPerson = false;
    this.personFound = false;
    this.clickedSearch = false;
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

  onDniInput(): void {
    const dniControl = this.registroForm.get('num_doc');
    const tipoDoc = this.registroForm.get('tipo_doc')?.value;

    if (tipoDoc === TablaMaestraTypeDocument.DNI && dniControl) {
      const dni = dniControl.value;

      // Solo ejecuta búsqueda si tiene 8 dígitos y todos son números
      if (dni && dni.length === 8 && /^\d+$/.test(dni)) {
        this.searchPerson();
      }
    }
  }
}
