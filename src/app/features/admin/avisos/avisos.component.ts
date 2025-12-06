import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css']  // <- CORREGIDO: styleUrls (plural)
})
export class AvisosComponent {

  columnas = ['aviso', 'acciones'];

  nuevoAviso = '';
  avisos: { mensaje: string }[] = [];

  agregarAviso() {
    if (!this.nuevoAviso || !this.nuevoAviso.trim()) return;
    this.avisos.push({ mensaje: this.nuevoAviso.trim() });
    this.nuevoAviso = '';
  }

  eliminarAviso(i: number) {
    this.avisos.splice(i, 1);
  }

  // Recibe el texto ya, no el objeto
  mostrarAviso(mensaje: string) {
    console.log('MOSTRAR:', mensaje);
    // Aquí -> envia al servicio, o setea variable para la pantalla
    // this.avisosService.setAviso(mensaje);
  }
}
