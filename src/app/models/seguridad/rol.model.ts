import { ResponseDTO } from '../base/ResponseDTO.model';

export interface Rol {
  rolId: number
  denominacion: string
  estado: number
}

export type RolResponse = ResponseDTO<Rol>;