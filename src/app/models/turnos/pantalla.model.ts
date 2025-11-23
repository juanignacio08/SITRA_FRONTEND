import { ConsultaResponseDTO } from "../base/ConsultaResponseDTO.model";
import { ResponseDTO } from "../base/ResponseDTO.model";
import { Persona } from "../seguridad/persona.model";

export interface Pantalla {
    orderAtencionId: number,
    llamadaId: number,
    atencionId: number,
    paciente: Persona,
    fecha: string,
    codPriority: string,
    turno: number,
    codEstadoAtencion: string,
    codVentanilla: string,
    numLlamada: number,
    codResultado: string
}

export type PantallaResponse = ResponseDTO<Pantalla>;
export type PantallaPaginatedResponse = ConsultaResponseDTO<Pantalla[]>;
export type PantallaListResponse = ResponseDTO<Pantalla[]>;