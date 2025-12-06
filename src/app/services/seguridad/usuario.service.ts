import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  UsuarioRequest,
  UsuarioResponse,
  UsuarioResponseList,
} from '../../models/seguridad/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/usuario';

  saveUser(user: UsuarioRequest): Observable<UsuarioResponse> {
    const url = `${this.baseUrl}/save`;
    return this.http.post<UsuarioResponse>(url, user);
  }

  editUser(user: UsuarioRequest): Observable<UsuarioResponse> {
    const url = `${this.baseUrl}/update`;
    return this.http.put<UsuarioResponse>(url, user);
  }

  getUsers(): Observable<UsuarioResponseList> {
    const url = `${this.baseUrl}/getUsuarios`;
    return this.http.get<UsuarioResponseList>(url);
  }

  deleteUser(userId: number): Observable<UsuarioResponse> {
    const url = `${this.baseUrl}/delete?id=${userId}`;
    return this.http.delete<UsuarioResponse>(url);
  }
  
}
