import { ResponseDTO } from '../base/ResponseDTO.model';
import { Persona } from './persona.model';
import { Rol } from './rol.model';

export interface Usuario {
  usuarioId: number
  usuario: string
  contrasena: string
  rol: Rol
  persona: Persona
  estado: number
}

export type UsuarioResponse = ResponseDTO<Usuario>;
