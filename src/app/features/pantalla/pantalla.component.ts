import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdenatencionService } from '../../services/turnos/ordenatencion.service';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';
import { ViewStatusOrderAtentionPipe } from '../../pipes/view-status-order-atention.pipe';

interface Paciente {
  codigo: string;
  nombre: string;
  estado:string;
}

@Component({
  selector: 'app-pantalla',
  imports: [
    CommonModule, ViewStatusOrderAtentionPipe
  ],
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent implements OnInit, OnDestroy {

  // Pacientes actualmente en ventanillas
  ventanilla1: Paciente = { codigo: 'A001', nombre: 'Pedro Martínez',estado:"atendiendo" };
  ventanilla2: Paciente = { codigo: 'A002', nombre: 'Ana Torres',estado:"atendiendo" };

  // Próximos pacientes
  
  ordersAtentionPreferentialList: OrdenAtencion[] = [];
  ordersAtentionNormalList: OrdenAtencion[] = [];

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
        console.log('Órdenes de atención normales obtenidas:', response.data);
        this.ordersAtentionNormalList = response.data;
      }
    })

    this.ordenAtencionService.getPreferentialPaginatedOrders(0, 10, fechaFormateada).subscribe({
      next: (response) => {
        console.log('Órdenes de atención preferenciales obtenidas:', response.data);
        this.ordersAtentionPreferentialList = response.data;
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
