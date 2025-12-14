import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdenatencionService } from '../../services/turnos/ordenatencion.service';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';
import { ViewStatusOrderAtentionPipe } from '../../pipes/view-status-order-atention.pipe';
import { TablaMaestraEstadosOrdenAtencion, TablaMaestraVentanillas } from '../../models/maestros/tablaMaestra.model';
import { ViewIconStatusOrdenAtentionPipe } from '../../pipes/view-icon-status-orden-atention.pipe';
import { Pantalla } from '../../models/turnos/pantalla.model';
import { AtencionService } from '../../services/turnos/atencion.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { NoticiasService } from '../../services/reportes/noticias.service';
import { Noticias } from '../../models/reportes/noticias.model';

@Component({
  selector: 'app-pantalla',
  imports: [
    CommonModule, ViewStatusOrderAtentionPipe, ViewIconStatusOrdenAtentionPipe, UserCardComponent
  ],
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent implements OnInit, OnDestroy {
  
  ordersAtentionNormalList: OrdenAtencion[] = [];
  orderAtentionListTruncate : OrdenAtencion[] = [];

  noticesList : Noticias[] = [];

  screenV1 ?: Pantalla;
  screenV2 ?: Pantalla;

  codStatusOrderAtentionInCall : string = TablaMaestraEstadosOrdenAtencion.EN_LLAMADA;
  codStatusOrderAtencionInAtention : string = TablaMaestraEstadosOrdenAtencion.ATENDIENDO;

  constructor(
    private ordenAtencionService: OrdenatencionService,
    private atencionService: AtencionService,
    private noticiaService: NoticiasService
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
    
    this.atencionService.getScreen(fechaFormateada, TablaMaestraVentanillas.VENTANILLA_1).subscribe({
      next: (response) => {
        this.screenV1 = response.data;
      }, error: (error) => {
        this.screenV1 = undefined;
        console.error(error);
      }
    })

    this.atencionService.getScreen(fechaFormateada, TablaMaestraVentanillas.VENTANILLA_2).subscribe({
      next: (response) => {
        this.screenV2 = response.data;
      }, error: (error) => {
        this.screenV2 = undefined;
        console.error(error);
      }
    })
    
    this.ordenAtencionService.getNormalPaginatedOrders(0, 1000, fechaFormateada).subscribe({
      next: (response) => {
        this.ordersAtentionNormalList = response.data;
        this.setListTruncate();
      }
    })
    
    this.noticiaService.getAllActives().subscribe({
      next: (response) => {
        this.noticesList = response.data;
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

  setListTruncate() {
    this.orderAtentionListTruncate = this.ordersAtentionNormalList.slice(0, 6);
  }

}
