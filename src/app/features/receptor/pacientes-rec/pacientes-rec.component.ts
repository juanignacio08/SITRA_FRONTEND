import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Persona } from '../../../models/seguridad/persona.model';
import { TablaMaestra, TablaMaestraEstadosOrdenAtencion, TablaMaestraPrioridades, TablaMaestraTypeDocument } from '../../../models/maestros/tablaMaestra.model';
import { Usuario } from '../../../models/seguridad/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { PersonaService } from '../../../services/seguridad/persona.service';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import { TablamaestraService } from '../../../services/maestro/tablamaestra.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../../services/seguridad/usuario.service';
import { ModalerrorComponent } from '../../../components/modalerror/modalerror.component';
import { OrdenAtencion, OrdenAtencionRequest } from '../../../models/turnos/ordenatencion.model';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {  AfterViewInit } from '@angular/core';


@Component({
  selector: 'app-pacientes-rec',
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
    RouterModule
  ],
  templateUrl: './pacientes-rec.component.html',
  styleUrl: './pacientes-rec.component.css'
})
export class PacientesRecComponent implements OnInit, AfterViewInit{

 



  isDesktop = window.innerWidth > 992; // breakpoint como Bootstrap lg

  @HostListener('window:resize') //Escucha eventos del navegador
  onResize() {
    this.isDesktop = window.innerWidth > 992;
  }

  registroForm!: FormGroup;

  person?: Persona;

  existsPerson: boolean = false;
  personFound: boolean = false;
  clickedSearch: boolean = false;

  typeDocumentOptions: TablaMaestra[] = [];

  userCurrent?: Usuario | null;

  public Prioridades = TablaMaestraPrioridades;

  loadTypeDocument: boolean = false;

  dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private personaService: PersonaService,
    private ordenAtencionService: OrdenatencionService,
    private tablamaestraService: TablamaestraService,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService
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
    this.userCurrent = this.usuarioService.getUserLoggedIn();
    if (
      this.userCurrent === null ||
      this.userCurrent === undefined ||
      this.userCurrent.rol.denominacion === 'Asesor'
    ) {
      this.router.navigate(['/sig-in']);
    }

    this.loadTypeDocuments();
  }

  /* Para que se haga autofocus con el cursor */
   @ViewChild('dniInput') dniInput!: ElementRef<HTMLInputElement>;
  ngAfterViewInit(): void {
    this.enfocarDni();
  }
  private enfocarDni(): void {
  setTimeout(() => {
    this.dniInput?.nativeElement.focus();
  }, 0);
}

  loadTypeDocuments() {
    this.loadTypeDocument = true;
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
          this.loadTypeDocument = false;
        },
        error: (err) => {
          this.initForm(TablaMaestraTypeDocument.DNI);
          this.loadTypeDocument = false;
          this.openModalError(err);
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

      if (result === 'usuario') {
        this.loadTypeDocuments();
      }
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
    if (this.registroForm.valid && this.userCurrent) {
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
          this.userCurrent?.usuarioId,
          priority,
          TablaMaestraEstadosOrdenAtencion.PENDIENTE,
          0,
          1
        );

        this.saveOrderAtention(orderAtencionRequest);
      } else {
        if (this.userCurrent) {
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
                receptorId: this.userCurrent?.usuarioId || 0,
                codPrioridad: priority,
                codEstadoAtencion: TablaMaestraEstadosOrdenAtencion.PENDIENTE,
                estado: 1,
              };

              this.saveOrderAtention(orderAtencionRequest);
            },
            error: (err) => {
              this.messageSnackBar('Error al registrar persona ⚠️');
            },
          });
        }
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
    this.usuarioService.logout();
    this.router.navigate(['/sig-in']);
  }

  searchPerson() {
    if (
      this.registroForm.get('tipo_doc')?.value !== TablaMaestraTypeDocument.DNI
    ) {
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
      tipo_doc: TablaMaestraTypeDocument.DNI, // Vuelve a seleccionar DNI por defecto
      num_doc: '',
      nombres: '',
      apellido_paterno: '',
      apellido_materno: '',
    });

    // Reinicia banderas de control
    this.existsPerson = false;
    this.personFound = false;
    this.clickedSearch = false;
    this.enfocarDni();

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
