import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdenatencionService } from '../../services/turnos/ordenatencion.service';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';
import { ViewStatusOrderAtentionPipe } from '../../pipes/view-status-order-atention.pipe';
import { TablaMaestraEstadosOrdenAtencion, TablaMaestraVentanillas } from '../../models/maestros/tablaMaestra.model';
import { ViewIconStatusOrdenAtentionPipe } from '../../pipes/view-icon-status-orden-atention.pipe';

interface Paciente {
  codigo: string;
  nombre: string;
  estado:string;
}

@Component({
  selector: 'app-pantalla',
  imports: [
    CommonModule, ViewStatusOrderAtentionPipe, ViewIconStatusOrdenAtentionPipe
  ],
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent implements OnInit, OnDestroy {
  
  ordersAtentionPreferentialList: OrdenAtencion[] = [];
  ordersAtentionNormalList: OrdenAtencion[] = [];

  orderAtentionNormalInCall ?: OrdenAtencion;
  orderAtentionPreferentialInCall ?: OrdenAtencion;

  codStatusOrderAtentionInCall : string = TablaMaestraEstadosOrdenAtencion.EN_LLAMADA;

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
    
    this.ordenAtencionService.getListOrderAtentionInCall(fechaFormateada).subscribe({
      next: (response) => {
        console.log("Ordenes de atencion en llamada", response.data);
        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].codVentanilla === TablaMaestraVentanillas.VENTANILLA_1) {
            this.orderAtentionNormalInCall = response.data[index];
          } else {
            this.orderAtentionPreferentialInCall = response.data[index];
          }
        }
      }
    })

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
