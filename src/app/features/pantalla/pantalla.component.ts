import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-pantalla',
  imports: [
    MatIconModule,
    MatListModule,
    CommonModule
  ],
  templateUrl: './pantalla.component.html',
  styleUrl: './pantalla.component.css'
})
export class PantallaComponent {
  pacienteVentanilla1: string = 'Juan Pérez';
  pacienteVentanilla2: string = 'María Gómez';

  listaPacientes: string[] = [
    'Pedro Martínez',
    'Ana Torres',
    'Luis Fernández',
    'Carla Rojas',
    'David López',
    'Sofía Ramírez'
  ];

}


