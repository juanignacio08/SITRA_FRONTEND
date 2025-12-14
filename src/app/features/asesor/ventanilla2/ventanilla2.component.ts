
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import {
  OrdenAtencion,
} from '../../../models/turnos/ordenatencion.model';
import {
  TablaMaestraEstadosOrdenAtencion,
  TablaMaestraPrioridades,
  TablaMaestraVentanillas,
} from '../../../models/maestros/tablaMaestra.model';
import { A11yModule } from '@angular/cdk/a11y';
import { AtencionService } from '../../../services/turnos/atencion.service';
import {
  Atencion,
  AtencionRequest,
} from '../../../models/turnos/atencion.model';
import { Pantalla } from '../../../models/turnos/pantalla.model';
import { LlamadaService } from '../../../services/turnos/llamada.service';
import { ViewStatusOrderAtentionPipe } from '../../../pipes/view-status-order-atention.pipe';
import { Usuario } from '../../../models/seguridad/usuario.model';
import { UsuarioService } from '../../../services/seguridad/usuario.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ModalerrorComponent } from '../../../components/modalerror/modalerror.component';

@Component({
  selector: 'app-ventanilla2',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    A11yModule,
    ViewStatusOrderAtentionPipe
  ],
  templateUrl: './ventanilla2.component.html',
  styleUrls: ['./ventanilla2.component.css'],
})
export class Ventanilla2Component implements OnInit {
  columnas: string[] = ['turno', 'nombre', 'numeroDocumento'];

  orderAtentionList: OrdenAtencion[] = [];
  screenNormal?: Pantalla;
  namePacienteInVentanilla: string = '';

  userCurrent?: Usuario | null;

  disabledCall: boolean = false;
  disabledStart: boolean = true;
  disabledFinish: boolean = true;
  disabledAbsent: boolean = true;

  loadScrean: boolean = false;
  loadOrders: boolean = false;

  loadCall: boolean = false;
  loadStart: boolean = false;
  loadFinish: boolean = false;
  loadAbsent: boolean = false;

  codeOrderStatusInCall = TablaMaestraEstadosOrdenAtencion.EN_LLAMADA;

  currentUtterance: SpeechSynthesisUtterance | null = null;

  orderAtentionService = inject(OrdenatencionService);
  llamadaService = inject(LlamadaService);
  atencionService = inject(AtencionService);
  usuarioService = inject(UsuarioService);
  router = inject(Router);
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.userCurrent = this.usuarioService.getUserLoggedIn();
    if (
      this.userCurrent === null ||
      this.userCurrent === undefined ||
      this.userCurrent.rol.denominacion === 'Receptor'
    ) {
      this.router.navigate(['/sig-in']);
    }
    this.getOrderAtentionInVentanilla();
    this.getOrdersAtentionNormal();
  }

  getDateFormatted(date: Date): string {
    const hoy = new Date();
    const fechaFormateada = hoy.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return fechaFormateada;
  }

  getOrdersAtentionNormal() {
    this.loadOrders = true;
    const fechaFormateada = this.getDateFormatted(new Date());

    this.orderAtentionService
      .getNormalPaginatedOrders(0, 100, fechaFormateada)
      .subscribe({
        next: (response) => {
          this.orderAtentionList = response.data;
          this.disabledButtons();
          this.loadOrders = false;
        }, error: (err) => {
          this.openModalError(err);
          this.loadOrders = false;
        }
      });
  }

  openModalError(error: any) {
      const dialogRef = this.dialog.open(ModalerrorComponent, {
        width: '500px',
        data: error,
        disableClose: true,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
  
        if (!result) return;
      });
    }

  getOrderAtentionInVentanilla() {
    this.loadScrean = true;
    const fechaFormateada = this.getDateFormatted(new Date());

    this.atencionService
      .getScreen(fechaFormateada, TablaMaestraVentanillas.VENTANILLA_2)
      .subscribe({
        next: (response) => {
          this.screenNormal = response.data;
          this.disabledButtons();
          this.loadScrean = false;
        },
        error: (error) => {
          this.openModalError(error);
          this.screenNormal = undefined;
          this.disabledButtons();
          this.loadScrean = false;
        },
      });
  }

  disabledButtons() {
    this.disabledCall = false;
    this.disabledStart = true;
    this.disabledFinish = true;
    this.disabledAbsent = true;

    if (this.screenNormal) {
      if (
        this.screenNormal.codEstadoAtencion ===
        TablaMaestraEstadosOrdenAtencion.EN_LLAMADA
      ) {
        this.disabledCall = false;
        this.disabledStart = false;
        if (this.screenNormal.numLlamada === 3) {
          this.disabledAbsent = false;
          this.disabledCall = true;
        }
      } else if (
        this.screenNormal.codEstadoAtencion ===
        TablaMaestraEstadosOrdenAtencion.ATENDIENDO
      ) {
        this.disabledFinish = false;
        this.disabledCall = true;
      } else {
        console.log('Caso no contemplado');
      }
    } else {
      this.disabledCall = false;
    }    

    if (this.orderAtentionList.length === 0 && (this.screenNormal === undefined || this.screenNormal === null)) {
      this.disabledCall = true;
    }
  }

  call() {
    if (
      (this.orderAtentionList.length != 0 || this.screenNormal) && (
        this.screenNormal == undefined ||
        (this.screenNormal &&
          this.screenNormal.codEstadoAtencion ===
            TablaMaestraEstadosOrdenAtencion.EN_LLAMADA &&
          this.screenNormal.numLlamada < 3
        )
      )
    ) {
      const fechaFormateada = this.getDateFormatted(new Date());
      this.loadCall = true;
      this.llamadaService
        .callNext(
          fechaFormateada,
          TablaMaestraPrioridades.NORMAL,
          TablaMaestraVentanillas.VENTANILLA_2,
          this.userCurrent?.usuarioId || 0
        )
        .subscribe({
          next: (response) => {
            if (response.data == null) {
              this.screenNormal = undefined;
              return;
            }
            this.screenNormal = response.data;

            this.namePacienteInVentanilla =
              this.screenNormal.paciente.nombre +
              ' ' +
              this.screenNormal.paciente.apellidoPaterno +
              ' ' +
              this.screenNormal.paciente.apellidoMaterno;
            
            this.disabledButtons();
            
            this.llamarTurno();

            this.getOrdersAtentionNormal();
            this.loadCall = false;
          },
          error: (error) => {
            console.error('Ocurrio un problema ', error);
            this.screenNormal = undefined;
            this.openModalError(error);
            this.disabledButtons();
            this.loadCall = false;
          },
        });
    }
  }

  llamarTurno() {
    const texto =
      'Turno de ' +
      this.namePacienteInVentanilla +
      ', acerquese a ventanilla 1.';

    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-ES'; // idioma español
    mensaje.rate = 0.75; // velocidad normal
    mensaje.pitch = 1; // tono normal

    // Opcional: elegir una voz específica si la conocés
    // const voces = speechSynthesis.getVoices();
    // mensaje.voice = voces.find(v => v.name.includes("Sabina"));

    window.speechSynthesis.speak(mensaje);
  }

  talk(message : string) {
    const mensaje = new SpeechSynthesisUtterance(message);
    mensaje.lang = 'es-ES'; // idioma español
    mensaje.rate = 0.75; // velocidad normal
    mensaje.pitch = 1; // tono normal

    // Opcional: elegir una voz específica si la conocés
    // const voces = speechSynthesis.getVoices();
    // mensaje.voice = voces.find(v => v.name.includes("Sabina"));

    window.speechSynthesis.speak(mensaje);
  }

  getFullName() : string {
    if (this.screenNormal) {
      this.namePacienteInVentanilla =
              this.screenNormal.paciente.nombre +
              ' ' +
              this.screenNormal.paciente.apellidoPaterno +
              ' ' +
              this.screenNormal.paciente.apellidoMaterno;
      return this.namePacienteInVentanilla;
    }
    
    return "No hay paciente en ventanilla";
  }

  startAtention() {
    if (this.screenNormal && this.screenNormal.codEstadoAtencion === TablaMaestraEstadosOrdenAtencion.EN_LLAMADA) {
      this.loadStart = true;
      const atention: AtencionRequest = {
        atencionId: 1,
        asesorId: this.userCurrent?.usuarioId || 0,
        ordenAtencionId: this.screenNormal.orderAtencionId,
        fecha: this.getDateFormatted(new Date()),
        codVentanilla: TablaMaestraVentanillas.VENTANILLA_2,
        estado: 1,
      };
      
      this.atencionService.saveAtention(atention).subscribe({
        next: (response) => {
          this.screenNormal = response.data;
          const message = "Iniciando atención a " + this.getFullName();
          this.talk(message)
          this.disabledButtons();
          this.getOrdersAtentionNormal();
          this.loadStart = false;
        },
        error: (error) => {
          console.error('Ocurrio un error en iniciar atention. ', error);
          this.openModalError(error);
          this.disabledButtons();
          this.loadStart = false;
        },
      });
    }
  }

  finishAtention() {
    if (
      this.screenNormal &&
      this.screenNormal.codEstadoAtencion ===
        TablaMaestraEstadosOrdenAtencion.ATENDIENDO
    ) {
      this.loadFinish = true;
      const atention: AtencionRequest = {
        atencionId: this.screenNormal.atencionId,
        asesorId: this.userCurrent?.usuarioId || 0,
        ordenAtencionId: this.screenNormal.orderAtencionId,
        fecha: this.getDateFormatted(new Date()),
        codVentanilla: TablaMaestraVentanillas.VENTANILLA_2,
        estado: 1,
      };

      this.atencionService.finish(atention).subscribe({
        next: (response) => {
          console.log(response.data);
          const message = "Finalizando atencion a " + this.getFullName();
          this.talk(message);

          this.screenNormal = undefined;
          this.disabledButtons();

          this.getOrdersAtentionNormal();
          this.loadFinish = false;
        },
        error: (error) => {
          console.error('Ocurrio un error en finalizar atention. ', error);
          this.openModalError(error);
          this.disabledButtons();
          this.loadFinish = false;
        },
      });
    }
  }

  absent() {
    if (
      this.screenNormal &&
      this.screenNormal.codEstadoAtencion ===
        TablaMaestraEstadosOrdenAtencion.EN_LLAMADA &&
      this.screenNormal.numLlamada === 3
    ) {
      this.loadAbsent = true;
      this.llamadaService.markAsAbsent(this.screenNormal.llamadaId, TablaMaestraVentanillas.VENTANILLA_2).subscribe({
        next: (response) => {
          this.screenNormal = response.data;
          const message = "Marcando como ausente a " + this.getFullName();
          this.talk(message);

          this.screenNormal = undefined;
          this.disabledButtons();
          this.getOrdersAtentionNormal();
          this.loadAbsent = false;
        },
        error: (error) => {
          console.error('Ocurrio un error en finalizar atention. ', error);
          this.openModalError(error);
          this.disabledButtons();
          this.loadAbsent = false;
        },
      });
    }
  }
}
