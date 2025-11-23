import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PacientesService } from '../../../shared/pacientes.service';
import { OrdenatencionService } from '../../../services/turnos/ordenatencion.service';
import {
  OrdenAtencion,
  OrdenAtencionRequest,
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
import { Persona } from '../../../models/seguridad/persona.model';
import { Pantalla } from '../../../models/turnos/pantalla.model';
import { LlamadaService } from '../../../services/turnos/llamada.service';
import { ViewStatusOrderAtentionPipe } from '../../../pipes/view-status-order-atention.pipe';

@Component({
  selector: 'app-pacientes',
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
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css'],
})
export class PacientesComponent implements OnInit {
  columnas: string[] = ['turno', 'nombre', 'numeroDocumento'];

  orderAtentionList: OrdenAtencion[] = [];
  screenNormal?: Pantalla;
  namePacienteInVentanilla: string = '';

  asesorId = 3; // ID del asesor (ejemplo estático)

  disabledCall: boolean = false;
  disabledStart: boolean = true;
  disabledFinish: boolean = true;
  disabledAbsent: boolean = true;

  codeOrderStatusInCall = TablaMaestraEstadosOrdenAtencion.EN_LLAMADA;

  currentUtterance: SpeechSynthesisUtterance | null = null;

  orderAtentionService = inject(OrdenatencionService);
  llamadaService = inject(LlamadaService);
  atencionService = inject(AtencionService);

  ngOnInit(): void {
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
    const fechaFormateada = this.getDateFormatted(new Date());

    this.orderAtentionService
      .getNormalPaginatedOrders(0, 10, fechaFormateada)
      .subscribe({
        next: (response) => {
          console.log('Órdenes de atención normales obtenidas:', response.data);
          this.orderAtentionList = response.data;
          this.disabledButtons();
        },
      });
  }

  getOrderAtentionInVentanilla() {
    const fechaFormateada = this.getDateFormatted(new Date());

    this.atencionService
      .getScreen(fechaFormateada, TablaMaestraVentanillas.VENTANILLA_1)
      .subscribe({
        next: (response) => {
          this.screenNormal = response.data;
          this.disabledButtons();
        },
        error: (error) => {
          console.error(
            'Error al obtener la siguiente orden de atención:',
            error
          );
          this.screenNormal = undefined;
          this.disabledButtons();
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

      this.llamadaService
        .callNext(
          fechaFormateada,
          TablaMaestraPrioridades.NORMAL,
          TablaMaestraVentanillas.VENTANILLA_1,
          this.asesorId
        )
        .subscribe({
          next: (response) => {
            if (response.data == null) {
              this.screenNormal = undefined;
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
          },
          error: (error) => {
            console.error('Ocurrio un problema ', error);
            if (
              error.error.detail ===
              'No se puede llamar cuando se tiene un paciente en atencion'
            ) {
              alert(error.error.detail);
            } else {
              this.screenNormal = undefined;
            }
            this.disabledButtons();
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
      const atention: AtencionRequest = {
        atencionId: 1,
        asesorId: this.asesorId,
        ordenAtencionId: this.screenNormal.orderAtencionId,
        fecha: this.getDateFormatted(new Date()),
        codVentanilla: TablaMaestraVentanillas.VENTANILLA_1,
        estado: 1,
      };
      console.log(atention);

      this.atencionService.saveAtention(atention).subscribe({
        next: (response) => {
          this.screenNormal = response.data;
          const message = "Iniciando atención a " + this.getFullName();
          this.talk(message)
          this.disabledButtons();
          this.getOrdersAtentionNormal();
        },
        error: (error) => {
          console.error('Ocurrio un error en iniciar atention. ', error);
          this.disabledButtons();
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
      const atention: AtencionRequest = {
        atencionId: this.screenNormal.atencionId,
        asesorId: this.asesorId,
        ordenAtencionId: this.screenNormal.orderAtencionId,
        fecha: this.getDateFormatted(new Date()),
        codVentanilla: TablaMaestraVentanillas.VENTANILLA_1,
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
        },
        error: (error) => {
          console.error('Ocurrio un error en finalizar atention. ', error);
          this.disabledButtons();
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
      this.llamadaService.markAsAbsent(this.screenNormal.llamadaId).subscribe({
        next: (response) => {
          this.screenNormal = response.data;
          const message = "Marcando como ausente a " + this.getFullName();
          this.talk(message);

          this.screenNormal = undefined;
          this.disabledButtons();
          this.getOrdersAtentionNormal();
        },
        error: (error) => {
          console.error('Ocurrio un error en finalizar atention. ', error);
          this.disabledButtons();
        },
      });
    }
  }
}
