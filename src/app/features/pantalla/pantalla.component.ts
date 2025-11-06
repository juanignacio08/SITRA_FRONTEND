import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdenatencionService } from '../../services/turnos/ordenatencion.service';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';

interface Paciente {
  codigo: string;
  nombre: string;
  estado:string;
}

@Component({
  selector: 'app-pantalla',
  imports: [
    CommonModule,
  ],
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent implements OnInit, OnDestroy {

  // Pacientes actualmente en ventanillas
  ventanilla1: Paciente = { codigo: 'A001', nombre: 'Pedro Martínez',estado:"atendiendo" };
  ventanilla2: Paciente = { codigo: 'A002', nombre: 'Ana Torres',estado:"atendiendo" };

  // Próximos pacientes
  proximosPacientes = [
    { codigo: 'A003', nombre: 'Carlos Alberto Francisco Fernández Pérez', estado:"pendiente" },
    { codigo: 'A004', nombre: 'David Alejandro Manuel López Torres',estado:"pendiente" },
    { codigo: 'A005', nombre: 'Elena Sofía Isabel Castro Díaz',estado:"pendiente" },
    { codigo: 'A006', nombre: 'Laura Victoria Isabel Giménez Morales',estado:"pendiente" },
    { codigo: 'A007', nombre: 'Carla Fernanda Beatriz Rojas Sánchez',estado:"pendiente" },
    { codigo: 'A008', nombre: 'Sofía Elena Margarita Ramírez Flores',estado:"pendiente" },
    { codigo: 'A003', nombre: 'Carlos Alberto Francisco Fernández Pérez' ,estado:"pendiente"},
    { codigo: 'A004', nombre: 'David Alejandro Manuel López Torres',estado:"pendiente"},
    { codigo: 'A005', nombre: 'Elena Sofía Isabel Castro Díaz',estado:"pendiente" },
    { codigo: 'A006', nombre: 'Laura Victoria Isabel Giménez Morales',estado:"pendiente" },
    { codigo: 'A007', nombre: 'Carla Fernanda Beatriz Rojas Sánchez',estado:"pendiente" },
    { codigo: 'A008', nombre: 'Sofía Elena Margarita Ramírez Flores',estado:"pendiente" },
  ];

  ordersAtentionList: OrdenAtencion[] = [];

  constructor(
    private ordenAtencionService: OrdenatencionService
  ) {}

  horaActual: Date = new Date();
  private timer: any;

  ngOnInit(): void {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    this.ordenAtencionService.getNormalPaginatedOrders(0, 10, fechaFormateada).subscribe({
      next: (response) => {
        console.log('Órdenes de atención obtenidas:', response.data);
        this.ordersAtentionList = response.data;
      }
    })

    this.timer = setInterval(() => this.horaActual = new Date(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  horaFormateada(): string {
    return this.horaActual.toLocaleTimeString('es-PE', { hour12: false });
  }

}
