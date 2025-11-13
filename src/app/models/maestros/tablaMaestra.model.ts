import { ResponseDTO } from "../base/ResponseDTO.model";

export interface TablaMaestra {
    idTablaMaestra: number;
    codigoTabla: string;
    codigoItem: string;
    codigo: string;
    orden: number;
    abreviatura: string;
    denominacion: string;
    esSistema: number;
    estado: number;
}

export type TablaMaestraResponse = ResponseDTO<TablaMaestra>;
export type TablaMaestraListResponse = ResponseDTO<TablaMaestra[]>;

export enum TablaMaestraPrioridades {
    NORMAL = '001001',
    PREFERENCIAL = '001002',
    URGENTE = '001003'
}

export enum TablaMaestraEstadosOrdenAtencion {
    PENDIENTE = '002001',
    EN_LLAMADA = '002002',
    ATENDIDO = '002003',
    AUSENTE = '002004',
    ATENDIENDO = '002005'
}

export enum TablaMaestraTypeDocument {
    DNI = '004001',
    CE = '004002'
}

export enum TablaMaestraVentanillas {
    VENTANILLA_1 = '003001',
    VENTANILLA_2 = '003002'
}