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

export type OrdenAtencionResponse = ResponseDTO<OrdenAtencion>;
export type OrdenAtencionPaginatedResponse = ConsultaResponseDTO<OrdenAtencion[]>;
export type OrdenAtencionListResponse = ResponseDTO<OrdenAtencion[]>;