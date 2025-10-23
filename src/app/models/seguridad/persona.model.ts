import { ResponseDTO } from '../base/ResponseDTO.model';
export interface Persona {
  personaId: number
  apellidoPaterno: string
  apellidoMaterno: string
  nombre: string
  tipoDocumentoIdentidad: string
  numeroDocumentoIdentidad: string
  estado: number
}

export type PersonaResponse = ResponseDTO<Persona>;
