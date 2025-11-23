import { ResponseDTO } from "../base/ResponseDTO.model"
import { Usuario } from "../seguridad/usuario.model"
import { OrdenAtencion } from "./ordenatencion.model"

export interface Atencion {
  atencionId: number
  asesor: Usuario
  ordenAtencion: OrdenAtencion
  fecha: string
  horaInicio: string
  horaFin: string
  codVentanilla: string
  observacion: string
  estado: number
}

export interface AtencionRequest {
    atencionId: number,
    asesorId: number,
    ordenAtencionId: number,
    fecha: string,
    horaInicio?: string,
    horaFin?: string,
    codVentanilla: string,
    observacion?: String,
    estado: number
}

export type AtencionResponse = ResponseDTO<Atencion>;
