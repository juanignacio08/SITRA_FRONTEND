import { ResponseDTO } from "../base/ResponseDTO.model";

export interface Noticias {
    noticiasId: number;
    contenido: string;
    estado: number;
}

export type NoticiasResponse = ResponseDTO<Noticias>;
export type NoticiasResponseList = ResponseDTO<Noticias[]>;
