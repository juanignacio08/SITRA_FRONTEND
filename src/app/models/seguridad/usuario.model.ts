import { ResponseDTO } from '../base/ResponseDTO.model';
import { Persona } from './persona.model';
import { Rol } from './rol.model';

export interface Usuario {
  usuarioId: number
  usuario: string
  contrasena: string
  codVentanilla : string
  rol: Rol
  persona: Persona
  estado: number
}

export interface UsuarioRequest {
  usuarioId: number
  numeroDocumento: string
  contrasena: string
  codVentanilla?: string
  rolId: number
  estado: number

  name?: string
  lastName1?: string
  lastName2?: string
  documentTypeCode?: string
}

export interface UsuarioModal {
  user : Usuario | null
  action : string
}

export type UsuarioResponse = ResponseDTO<Usuario>;

export type UsuarioResponseList = ResponseDTO<Usuario[]>;