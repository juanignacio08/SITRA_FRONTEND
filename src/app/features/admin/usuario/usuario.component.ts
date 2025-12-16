import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegistroComponent } from './modal/registro/registro.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from '../../../services/seguridad/usuario.service';
import { Usuario, UsuarioModal } from '../../../models/seguridad/usuario.model';
import { ModalerrorComponent } from '../../../components/modalerror/modalerror.component';
import { Router } from '@angular/router';
import { ViewVentanillaPipe } from '../../../pipes/view-ventanilla.pipe';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    ReactiveFormsModule,
    ViewVentanillaPipe
  ],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {

  dialog = inject(MatDialog);
  userService = inject(UsuarioService);

  columnas = ["nombreCompleto", "dni", "rol","acciones"];

  user?: Usuario | null;

  usuarios: Usuario[] = [];

  loadUsers: boolean = true;

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.user = this.usuarioService.getUserLoggedIn();
    if (
      this.user === null ||
      this.user === undefined ||
      this.user.rol.denominacion !== 'Administrador'
    ) {
      this.router.navigate(['/sig-in']);
    } else {
      this.cargarUsuarios();
    }
  }

  cargarUsuarios() {
    this.loadUsers = true;
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.usuarios = response.data;
        this.loadUsers = false;
      }, error: (err) => {
        console.log(err);
        this.loadUsers = false;
        this.openModalError(err)
      }
    })
  }

  openModalError(error : any) {
    const dialogRef = this.dialog.open(ModalerrorComponent, {
      width: '500px',
      data: error,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
      if (!result) return;
      if (result === "usuario") {
        this.cargarUsuarios();
      }
    })
  }

  abrirModal(usuario : Usuario | null, action : string) {
    const userModal : UsuarioModal = {
      user: usuario,
      action: action
    }

    const dialogRef = this.dialog.open(RegistroComponent, {
      width: '500px',
      data: userModal,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      
      if (!result) return;

      if (result === "deleted") {
        this.cargarUsuarios();
      } else if (result === "edited") {
        this.cargarUsuarios();
      } else if (result === "saved") {
        // Crear usuario nuevo
        this.cargarUsuarios();
      } else {
        console.log("opcion no contemplada");
      }
    });
  }
}
