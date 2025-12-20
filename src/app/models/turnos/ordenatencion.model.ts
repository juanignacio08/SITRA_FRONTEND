import { ConsultaResponseDTO } from '../base/ConsultaResponseDTO.model';
import { ResponseDTO } from '../base/ResponseDTO.model';
import { TablaMaestra, TablaMaestraEstadosOrdenAtencion, TablaMaestraPrioridades, TablaMaestraVentanillas } from '../maestros/tablaMaestra.model';
import { Persona } from '../seguridad/persona.model';
import { Usuario } from '../seguridad/usuario.model';

export interface OrdenAtencion {
  ordenAtencionId: number
  persona: Persona
  receptor: Usuario
  fecha: string
  hora: string
  codPrioridad: string
  turno: number
  codEstadoAtencion: string
  estado: number
}

export interface OrdenAtencionRequest {
  ordenAtencionId: number
  personaId: number
  receptorId: number
  codPrioridad: TablaMaestraPrioridades,
  codEstadoAtencion: TablaMaestraEstadosOrdenAtencion,
  estado: number
}

export interface OrdenATencionProjection {
  ordenatencionid: number
  receptorid: number
  fecha: string
  hora: string
  codestadoatencion: string
  codventanillaOa: string

  personaid: number
  nombres: string
  apellidopaterno: string
  apellidomaterno: string
  numerodocumentoidentidad: string

  llamadaid: number
  asesoridLl: number
  codventanillaLl: string
  fechallamada: string
  horallamada: string
  numllamada: number
  codresultado: string
  
  asesorNombre : number

  atencionid: number
  fechaatencion: string
  horainicio: string
  horafin: string
  turno: number
  codventanillaAte: string
  asesoridAte: number
}

export type OrdenAtencionResponse = ResponseDTO<OrdenAtencion>;
export type OrdenAtencionPaginatedResponse = ConsultaResponseDTO<OrdenAtencion[]>;
export type OrdenAtencionListResponse = ResponseDTO<OrdenAtencion[]>;
export type OrdenAtencionListProjectionResponse = ResponseDTO<OrdenATencionProjection[]>;