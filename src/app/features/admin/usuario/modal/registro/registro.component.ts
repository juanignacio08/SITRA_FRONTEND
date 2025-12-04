import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-usuario-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  form: FormGroup;

  roles = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Receptor' },
    { id: 3, nombre: 'Asesor' }
  ];

  ventanillas = [
    { id: 1, nombre: 'Ventanilla 1' },
    { id: 2, nombre: 'Ventanilla 2' },
    { id: 3, nombre: 'Ventanilla 3' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegistroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],

      rol: ['', Validators.required],
      ventanilla: ['', Validators.required],

      usuario: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
