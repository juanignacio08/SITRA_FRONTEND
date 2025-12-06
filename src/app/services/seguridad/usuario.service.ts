import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  Usuario,
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
  user : Usuario | null = null;

  private readonly baseUrl = environment.apiUrl + '/usuario';

  constructor() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  }

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
  
  sigIn(user : string, password: string): Observable<UsuarioResponse> {
    const url = `${this.baseUrl}/getUsuarioByUserAndPassword?user=${user}&password=${password}`;
    return this.http.get<UsuarioResponse>(url);
  }

  getUserLoggedIn(): Usuario | null {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    } else {
      this.user = null;
    }    
    return this.user;
  }

  setUserLoggedIn(user: Usuario | null): void {
    this.user = user;
    if (user === null) {
      localStorage.removeItem('user');
      return;
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout(): void {
    this.user = null;
    localStorage.removeItem('user');
  }
  
 }
