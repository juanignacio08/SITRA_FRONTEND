import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { TablaMaestraTypeDocument } from '../../../../../models/maestros/tablaMaestra.model';
import { PersonaService } from '../../../../../services/seguridad/persona.service';
import { Persona } from '../../../../../models/seguridad/persona.model';
import { UsuarioService } from '../../../../../services/seguridad/usuario.service';
import {
  UsuarioRequest,
  UsuarioModal,
} from '../../../../../models/seguridad/usuario.model';
import { Rol } from '../../../../../models/seguridad/rol.model';
import { RolService } from '../../../../../services/seguridad/rol.service';

@Component({
  selector: 'app-usuario-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatOptionModule,
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  form: FormGroup;

  person: Persona | null = null;

  existsPerson: boolean = false;
  personFound: boolean = false;

  user?: UsuarioRequest;

  loadSave: boolean = false;
  loadEdit: boolean = false;
  loadDelete: boolean = false;
  loadRol: boolean = true;

  error: boolean = false;
  errorMessage: string = '';

  messageDelete?: string;

  roles: Rol[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioModal,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private rolService: RolService
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.data) {
      if (this.data.action === 'create') {
        this.form = this.fb.group({
          nombres: [{ value: '', disabled: true }, Validators.required],
          apellidoPaterno: [{ value: '', disabled: true }, Validators.required],
          apellidoMaterno: [{ value: '', disabled: true }, Validators.required],
          dni: [
            '',
            [
              Validators.required,
              Validators.minLength(8),
              Validators.maxLength(8),
            ],
          ],

          rol: ['', Validators.required],

          contraseña: ['', Validators.required],
        });
        this.loadRoles();
      } else if (this.data.action === 'edit') {
        if (this.data.user) {
          const user = this.data.user;
          this.form = this.fb.group({
            nombres: [
              { value: user.persona.nombre, disabled: true },
              Validators.required,
            ],
            apellidoPaterno: [
              { value: user.persona.apellidoPaterno, disabled: true },
              Validators.required,
            ],
            apellidoMaterno: [
              { value: user.persona.apellidoMaterno, disabled: true },
              Validators.required,
            ],
            dni: [
              { value: user.persona.numeroDocumentoIdentidad, disabled: true },
              [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(8),
              ],
            ],

            rol: ['', Validators.required],

            contraseña: ['', Validators.required],
          });
          this.loadRoles();
        }
      } else if (this.data.action == 'delete') {
        if (this.data.user) {
          this.loadRol = false;
          this.messageDelete = `¿Está seguro que desea eliminar al usuario con DNI ${this.data.user.persona.numeroDocumentoIdentidad}?`;
        }
      }
    }
  }

  loadRoles() {
    this.loadRol = true;
    this.rolService.getRols().subscribe({
      next: (response) => {
        this.roles = response.data;
        this.loadRol = false;
      },
      error: (err) => {
        console.error('Error al cargar roles:', err);
        this.loadRol = false;
      },
    });
  }

  onDniInput() {
    const dniControl = this.form.get('dni');
    const tipoDoc = TablaMaestraTypeDocument.DNI; // Asumiendo que el tipo de documento es DNI

    if (tipoDoc === TablaMaestraTypeDocument.DNI && dniControl) {
      const dni = dniControl.value;

      // Solo ejecuta búsqueda si tiene 8 dígitos y todos son números
      if (dni && dni.length === 8 && /^\d+$/.test(dni)) {
        this.searchPerson();
      } else {
        this.notFoundPerson();
        this.existsPerson = false;
        this.personFound = false;
      }
    } else {
      this.notFoundPerson();
      this.existsPerson = false;
      this.personFound = false;
    }

    this.error = false;
  }

  searchPerson() {
    if (this.form.get('dni')?.invalid) {
      console.warn('Número de documento inválido');
      return;
    }

    const dni = this.form.get('dni')?.value;

    this.personaService.getPersonByDni(dni).subscribe({
      next: (response) => {
        const person: Persona = response.data;
        this.person = person;
        this.completeDataPerson(person);
        this.enableNamesControls(false);
      },
      error: (err) => {
        this.personaService.getDniInfo(dni).subscribe({
          next: (response) => {
            this.form.patchValue({
              nombres: this.capitalize(response.first_name),
              apellidoPaterno: this.capitalize(response.first_last_name),
              apellidoMaterno: this.capitalize(response.second_last_name),
            });
            this.existsPerson = true;
            this.personFound = false;
            this.enableNamesControls(false);
          },
          error: (err) => {
            this.notFoundPerson();
            this.existsPerson = false;
            this.personFound = false;
            this.enableNamesControls(true);
          },
        });
        console.error('Error al buscar persona por DNI:', err);
      },
    });
  }

  private notFoundPerson() {
    this.form.patchValue({
      nombres: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
    });
  }

  private completeDataPerson(persona: Persona) {
    this.form.patchValue({
      nombres: this.capitalize(persona.nombre),
      apellidoPaterno: this.capitalize(persona.apellidoPaterno),
      apellidoMaterno: this.capitalize(persona.apellidoMaterno),
    });
    this.personFound = true;
    this.existsPerson = true;
  }

  private capitalize(str: string | null | undefined): string {
    if (!str) return '';

    const cleanStr = String(str).trim();

    const lowerCaseStr = cleanStr.toLowerCase();

    return lowerCaseStr.replace(/(^|\s)([a-zñáéíóúü])/g, (match, p1, p2) => {
      return p1 + p2.toUpperCase();
    });
  }

  private enableNamesControls(bandera: boolean) {
    if (bandera) {
      this.form.get('nombres')?.enable();
      this.form.get('apellidoPaterno')?.enable();
      this.form.get('apellidoMaterno')?.enable();
    } else {
      this.form.get('nombres')?.disable();
      this.form.get('apellidoPaterno')?.disable();
      this.form.get('apellidoMaterno')?.disable();
    }
  }

  guardar() {
    if (this.form.valid) {
      this.loadSave = true;

      if (this.personFound && this.person) {
        this.user = {
          usuarioId: 1,
          numeroDocumento: this.person.numeroDocumentoIdentidad,
          contrasena: this.form.get('contraseña')?.value,
          rolId: this.form.get('rol')?.value,
          estado: 1,
        };
      } else if (this.existsPerson) {
        this.user = {
          usuarioId: 1,
          numeroDocumento: this.form.get('dni')?.value,
          contrasena: this.form.get('contraseña')?.value,
          rolId: this.form.get('rol')?.value,
          estado: 1,
          name: this.form.get('nombres')?.value,
          lastName1: this.form.get('apellidoPaterno')?.value,
          lastName2: this.form.get('apellidoMaterno')?.value,
          documentTypeCode: TablaMaestraTypeDocument.DNI,
        };
      } else {
        this.user = {
          usuarioId: 1,
          numeroDocumento: this.form.get('dni')?.value,
          contrasena: this.form.get('contraseña')?.value,
          rolId: this.form.get('rol')?.value,
          estado: 1,
          name: this.form.get('nombres')?.value,
          lastName1: this.form.get('apellidoPaterno')?.value,
          lastName2: this.form.get('apellidoMaterno')?.value,
          documentTypeCode: TablaMaestraTypeDocument.DNI,
        };
      }

      this.usuarioService.saveUser(this.user).subscribe({
        next: (response) => {
          console.log(response.message);
          this.loadSave = false;
          this.error = false;
          this.errorMessage = '';
          this.dialogRef.close('saved');
        },
        error: (err) => {
          console.error(err);
          this.error = true;
          this.errorMessage =
            err.error?.detail || 'Ocurrió un error al guardar el usuario.';
          this.loadSave = false;
        },
      });
    }
  }

  editUser() {
    if (this.form.valid && this.data.user && this.data.action === 'edit') {
      this.loadEdit = true;
      const userRequest: UsuarioRequest = {
        usuarioId: this.data.user.usuarioId,
        numeroDocumento: this.data.user.usuario,
        contrasena: this.form.get('contraseña')?.value,
        rolId: this.form.get('rol')?.value,
        estado: 1,
      };

      this.usuarioService.editUser(userRequest).subscribe({
        next: (response) => {
          console.log(response.message);
          this.loadEdit = false;
          this.error = false;
          this.errorMessage = '';
          this.dialogRef.close('edited');
        },
        error: (err) => {
          console.error(err);
          this.error = true;
          this.errorMessage =
            err.error?.detail || 'Ocurrió un error al editar el usuario.';
          this.loadEdit = false;
        },
      });
    }
  }

  deleteUser() {
    const userAux = this.usuarioService.getUserLoggedIn();

    if (userAux && this.data.user && this.data.action === 'delete') {
      if (this.data.user.usuarioId === userAux.usuarioId) {
        this.error = true;
        this.errorMessage =
          'No se puede eliminar a este usuario porque tiene la sesion activa.';
      } else {
        this.loadDelete = true;
        console.log('Eliminando usuario: ', this.data.user);
        this.usuarioService.deleteUser(this.data.user.usuarioId).subscribe({
          next: (response) => {
            console.log(response.message);
            this.loadDelete = false;
            this.error = false;
            this.errorMessage = '';
            this.dialogRef.close('deleted');
          },
          error: (err) => {
            console.error(err);
            this.error = true;
            this.errorMessage =
              err.error?.detail || 'Ocurrió un error al eliminar el usuario.';
            this.loadDelete = false;
          },
        });
      }
    }
  }
  cerrar() {
    this.dialogRef.close();
  }
}
