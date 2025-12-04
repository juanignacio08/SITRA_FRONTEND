import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegistroComponent } from './modal/registro/registro.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  dialog = inject(MatDialog);

  columnas = ["nombreCompleto", "dni", "rol", "ventanilla", "acciones"];

  usuarios: any[] = [];

  abrirModal(usuario?: any) {
    const dialogRef = this.dialog.open(RegistroComponent, {
      width: '500px',
      data: usuario ?? null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (usuario) {
        // Editar usuario
        Object.assign(usuario, result);
      } else {
        // Crear usuario nuevo
        this.usuarios.push(result);
      }
    });
  }
}
