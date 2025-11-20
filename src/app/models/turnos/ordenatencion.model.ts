import { ConsultaResponseDTO } from '../base/ConsultaResponseDTO.model';
import { ResponseDTO } from '../base/ResponseDTO.model';
import { TablaMaestra, TablaMaestraEstadosOrdenAtencion, TablaMaestraPrioridades, TablaMaestraVentanillas } from '../maestros/tablaMaestra.model';
import { Persona } from '../seguridad/persona.model';
import { Usuario } from '../seguridad/usuario.model';

export interface OrdenAtencion {
  ordenAtencionId: number
  persona: Persona
  receptor: Usuario
  asesor: Usuario
  fecha: string
  hora: string
  codPrioridad: string
  turno: number
  codEstadoAtencion: string
  numLlamadas: number
  codVentanilla: string
  estado: number
}

export interface OrdenAtencionRequest {
  ordenAtencionId: number
  personaId: number
  receptorId: number
  asesorId?: number
  codPrioridad: TablaMaestraPrioridades,
  codEstadoAtencion: TablaMaestraEstadosOrdenAtencion,
  numLlamadas: number
  estado: number
  codVentanilla?: TablaMaestraVentanillas
}

export type OrdenAtencionResponse = ResponseDTO<OrdenAtencion>;
export type OrdenAtencionPaginatedResponse = ConsultaResponseDTO<OrdenAtencion[]>;
export type OrdenAtencionListResponse = ResponseDTO<OrdenAtencion[]>;