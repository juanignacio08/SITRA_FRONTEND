import { ResponseDTO } from "../base/ResponseDTO.model";

export interface TablaMaestra {
    idTablaMaestra: number;
    codigo: string;
    denominacion: string;
}

export type TablaMaestraResponse = ResponseDTO<TablaMaestra>;