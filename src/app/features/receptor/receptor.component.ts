import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
import { UsuarioService } from '../../services/seguridad/usuario.service';
import { Usuario } from '../../models/seguridad/usuario.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalerrorComponent } from '../../components/modalerror/modalerror.component';

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
    RouterModule
  ],

  templateUrl: './receptor.component.html',
  styleUrls: ['./receptor.component.css'],
})
export class ReceptorComponent implements OnInit {
  
  userCurrent?: Usuario | null;
  
  isDesktop = window.innerWidth > 992; // breakpoint como Bootstrap lg

  @HostListener('window:resize') //Escucha eventos del navegador
  onResize() {
    this.isDesktop = window.innerWidth > 992;
  }

  constructor(
    private router: Router,
    private usuarioService : UsuarioService
  ) {
  }

  ngOnInit(): void {
    this.userCurrent = this.usuarioService.getUserLoggedIn();
    if (
      this.userCurrent === null ||
      this.userCurrent === undefined ||
      this.userCurrent.rol.denominacion === 'Asesor' ||
      this.userCurrent.rol.denominacion === 'Administrador'
    ) {
      this.router.navigate(['/sig-in']);
    }
  }
  
  verPerfil() {
    /* ... */
  }

  cerrarSesion() {
    this.usuarioService.logout();
    this.router.navigate(['/sig-in']);
  }


}
