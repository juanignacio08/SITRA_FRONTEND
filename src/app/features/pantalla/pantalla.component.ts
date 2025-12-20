import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdenatencionService } from '../../services/turnos/ordenatencion.service';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';
import { ViewStatusOrderAtentionPipe } from '../../pipes/view-status-order-atention.pipe';
import {
  TablaMaestraEstadosOrdenAtencion,
  TablaMaestraVentanillas,
} from '../../models/maestros/tablaMaestra.model';
import { ViewIconStatusOrdenAtentionPipe } from '../../pipes/view-icon-status-orden-atention.pipe';
import { Pantalla } from '../../models/turnos/pantalla.model';
import { AtencionService } from '../../services/turnos/atencion.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { NoticiasService } from '../../services/reportes/noticias.service';
import { Noticias } from '../../models/reportes/noticias.model';
import { Subscription } from 'rxjs';
import { OrdenAtencionSocketService } from '../../services/turnos/orden-atencion-socket.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pantalla',
  imports: [
    CommonModule,
    ViewStatusOrderAtentionPipe,
    ViewIconStatusOrdenAtentionPipe,
    UserCardComponent,
    MatSnackBarModule,
  ],
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css'],
})
export class PantallaComponent implements OnInit, OnDestroy {
  ordersAtentionNormalList: OrdenAtencion[] = [];
  orderAtentionListTruncate: OrdenAtencion[] = [];

  noticesList: Noticias[] = [];

  screenV1?: Pantalla;
  screenV2?: Pantalla;

  codStatusOrderAtentionInCall: string =
    TablaMaestraEstadosOrdenAtencion.EN_LLAMADA;
  codStatusOrderAtencionInAtention: string =
    TablaMaestraEstadosOrdenAtencion.ATENDIENDO;

  private websocketSubscription!: Subscription;

  constructor(
    private ordenAtencionService: OrdenatencionService,
    private atencionService: AtencionService,
    private noticiaService: NoticiasService,
    public webSocketService: OrdenAtencionSocketService,
    private snackBar: MatSnackBar
  ) {}

  horaActual: Date = new Date();
  private timer: any;

  ngOnInit(): void {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    this.atencionService
      .getScreen(fechaFormateada, TablaMaestraVentanillas.VENTANILLA_1)
      .subscribe({
        next: (response) => {
          this.screenV1 = response.data;
        },
        error: (error) => {
          this.screenV1 = undefined;
          console.error(error);
        },
      });

    this.atencionService
      .getScreen(fechaFormateada, TablaMaestraVentanillas.VENTANILLA_2)
      .subscribe({
        next: (response) => {
          this.screenV2 = response.data;
        },
        error: (error) => {
          this.screenV2 = undefined;
          console.error(error);
        },
      });

    this.ordenAtencionService
      .getNormalPaginatedOrders(0, 1000, fechaFormateada)
      .subscribe({
        next: (response) => {
          this.ordersAtentionNormalList = response.data;
          this.setListTruncate();
        },
      });

    this.noticiaService.getAllActives().subscribe({
      next: (response) => {
        this.noticesList = response.data;
      },
    });

    // SUSCRIBIRSE a nuevas órdenes (IMPORTANTE)
    this.suscribirseANuevasOrdenes();
    this.suscribirseANuevaLLamada();
    this.suscribirseANuevaAtencion();
    this.suscribirseAFinalizarAtencion();
    this.suscribirseANuevaAusencia();
    this.suscribirseANuevaNoticia();
    this.suscribirseAEditarNoticia();
    this.suscribirseAEliminarNoticia();

    this.timer = setInterval(() => (this.horaActual = new Date()), 1000);
  }

  private suscribirseAEliminarNoticia(): void {
    this.websocketSubscription = this.webSocketService
      .getEliminarNoticiaObservable()
      .subscribe({
        next: (noticia) => {
          if (noticia) {
            console.log('📥 [COMPONENTE] Noticia-Eliminar recibida:', noticia);
            this.deleteNoticia(noticia);
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  private suscribirseAEditarNoticia(): void {
    this.websocketSubscription = this.webSocketService
      .getEditarNoticiaObservable()
      .subscribe({
        next: (noticia) => {
          if (noticia) {
            console.log('📥 [COMPONENTE] Noticia-Editar recibida:', noticia);
            this.updateNoticia(noticia);
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  private suscribirseANuevaNoticia(): void {
    this.websocketSubscription = this.webSocketService
      .getNuevaNoticiaObservable()
      .subscribe({
        next: (nuevaNoticia) => {
          if (nuevaNoticia) {
            console.log(
              '📥 [COMPONENTE] Nueva Noticia recibida:',
              nuevaNoticia
            );
            this.addNoticia(nuevaNoticia);
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  addNoticia(notice: Noticias) {
    // Verificar si ya existe
    const existe = this.noticesList.some(
      (o) => o.noticiasId === notice.noticiasId
    );

    if (!existe) {
      // Agregar al INICIO de la lista
      this.noticesList = [...this.noticesList, notice];
    }
  }

  updateNoticia(notice: Noticias) {
    // Verificar si ya existe
    const existe = this.noticesList.some(
      (o) => o.noticiasId === notice.noticiasId
    );

    if (existe) {
      if (notice.estado === 0) {
        this.deleteNoticia(notice);
      } else {
        this.noticesList = this.noticesList.map((o) =>
          o.noticiasId === notice.noticiasId ? notice : o
        );
      }
    } else {
      this.addNoticia(notice);
    }
  }

  deleteNoticia(notice: Noticias) {
    // Verificar si ya existe
    const existe = this.noticesList.some(
      (o) => o.noticiasId === notice.noticiasId
    );

    if (existe) {
      this.noticesList = this.noticesList.filter(
        (p) => p.noticiasId !== notice.noticiasId
      );
    }
  }

  private suscribirseAFinalizarAtencion(): void {
    this.websocketSubscription = this.webSocketService
      .getFinalizarAtencionObservable()
      .subscribe({
        next: (atencion) => {
          if (atencion) {
            console.log(
              '📥 [COMPONENTE] Nueva Ausencia recibida:',
              atencion.codVentanilla
            );
            this.addVentanilla(atencion);
            
            if (this.ordersAtentionNormalList.length === 0) {
              this.clearVentanillas();
            }
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  private suscribirseANuevaAusencia(): void {
    this.websocketSubscription = this.webSocketService
      .getNuevaAusenciaObservable()
      .subscribe({
        next: (nuevaAusencia) => {
          if (nuevaAusencia) {
            console.log(
              '📥 [COMPONENTE] Nueva Ausencia recibida:',
              nuevaAusencia.codVentanilla
            );
            this.addVentanilla(nuevaAusencia);

            if (this.ordersAtentionNormalList.length === 0) {
              this.clearVentanillas();
            }
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  private suscribirseANuevaAtencion(): void {
    this.websocketSubscription = this.webSocketService
      .getNuevaAtencionObservable()
      .subscribe({
        next: (nuevaAtencion) => {
          if (nuevaAtencion) {
            console.log(
              '📥 [COMPONENTE] Nueva Atencion recibida:',
              nuevaAtencion.codVentanilla
            );
            this.addVentanilla(nuevaAtencion);
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  private suscribirseANuevaLLamada(): void {
    this.websocketSubscription = this.webSocketService
      .getNuevaLlamadaObservable()
      .subscribe({
        next: (nuevaLlamada) => {
          if (nuevaLlamada) {
            console.log(
              '📥 [COMPONENTE] Nueva Llamada recibida:',
              nuevaLlamada.codVentanilla
            );
            this.addVentanilla(nuevaLlamada);
            this.deleteOrderFromList(nuevaLlamada);
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  addVentanilla(pantalla: Pantalla) {
    if (pantalla.codVentanilla === TablaMaestraVentanillas.VENTANILLA_1) {
      this.screenV1 = pantalla;
    } else if (
      pantalla.codVentanilla === TablaMaestraVentanillas.VENTANILLA_2
    ) {
      this.screenV2 = pantalla;
    } else {
      console.error('Opcion no contemplada.');
    }
  }

  deleteOrderFromList(llamada: Pantalla) {
    this.ordersAtentionNormalList = this.ordersAtentionNormalList.filter(
      (p) => p.ordenAtencionId !== llamada.orderAtencionId
    );

    this.setListTruncate();
  }

  private suscribirseANuevasOrdenes(): void {
    this.websocketSubscription = this.webSocketService
      .getNuevasOrdenesObservable()
      .subscribe({
        next: (nuevaOrden) => {
          if (nuevaOrden) {
            console.log('📥 [COMPONENTE] Nueva orden recibida:', nuevaOrden);
            this.agregarOrdenALista(nuevaOrden);
          }
        },
        error: (error) => {
          console.error('❌ Error en suscripción:', error);
        },
      });
  }

  private agregarOrdenALista(orden: OrdenAtencion): void {
    console.log('➕ Agregando orden a lista:', orden.turno);

    // Verificar si ya existe
    const existe = this.ordersAtentionNormalList.some(
      (o) => o.ordenAtencionId === orden.ordenAtencionId
    );

    if (!existe) {
      // Agregar al INICIO de la lista
      this.ordersAtentionNormalList = [...this.ordersAtentionNormalList, orden];

      // Actualizar lista truncada
      this.setListTruncate();

      this.snackBar.open(
        `🎉 NUEVO TURNO: ${orden.turno} - ${orden.persona.personaId}`,
        'Cerrar', // texto del botón opcional
        {
          duration: 2000, // 3 segundos
          horizontalPosition: 'right', // 'start' | 'center' | 'end' | 'left' | 'right'
          verticalPosition: 'top', // 'top' | 'bottom'
        }
      );

      console.log('✅ Orden agregada correctamente');
    } else {
      console.log('⚠️ Orden ya existe en la lista');
    }
  }

  clearVentanillas() {
    if (this.screenV1) {
      if (this.screenV1.codEstadoAtencion === TablaMaestraEstadosOrdenAtencion.ATENDIDO
        || this.screenV1.codEstadoAtencion === TablaMaestraEstadosOrdenAtencion.AUSENTE
      ) {
        this.screenV1 = undefined;
      }
    }

    if (this.screenV2) {
      if (this.screenV2.codEstadoAtencion === TablaMaestraEstadosOrdenAtencion.ATENDIDO
        || this.screenV2.codEstadoAtencion === TablaMaestraEstadosOrdenAtencion.AUSENTE
      ) {
        this.screenV2 = undefined;
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
  }

  horaFormateada(): string {
    return this.horaActual.toLocaleTimeString('es-PE', { hour12: false });
  }

  setListTruncate() {
    this.orderAtentionListTruncate = this.ordersAtentionNormalList.slice(0, 6);
  }
}
