import { ResponseDTO } from "../base/ResponseDTO.model";

export interface TablaMaestra {
    idTablaMaestra: number;
    codigo: string;
    denominacion: string;
}

export type TablaMaestraResponse = ResponseDTO<TablaMaestra>;

export const enum TablaMaestraPrioridades {
    NORMAL = '001001',
    PREFERENCIAL = '001002',
    URGENTE = '001003'
}

export const enum TablaMaestraEstadosOrdenAtencion {
    PENDIENTE = '002001',
    EN_LLAMADA = '002002',
    ATENDIDO = '002003',
    AUSENTE = '002004',
    ATENDIENDO = '002005'
}