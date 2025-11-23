import { ConsultaResponseDTO } from "../base/ConsultaResponseDTO.model";
import { ResponseDTO } from "../base/ResponseDTO.model";
import { Usuario } from "../seguridad/usuario.model";
import { OrdenAtencion } from "./ordenatencion.model";

export interface Llamada {
    llamadaId: number,
    ordenAtencion: OrdenAtencion,
    asesor: Usuario,
    codVentanilla: string,
    fechaLlamada: string,
    horaLLamada: string,
    numLlamada: number,
    codResultado: string,
    estado: number
}

export interface LlamadaRequest {
    ordenAtencionId: number,
    asesorId: number,
    codVentanilla: string,
    numLlamada: number,
    codResultado: string,
    estado: number
}

export type LlamadaResponse = ResponseDTO<Llamada>;
export type LlamadaPaginatedResponse = ConsultaResponseDTO<Llamada[]>;
export type LlamadaListResponse = ResponseDTO<Llamada[]>;