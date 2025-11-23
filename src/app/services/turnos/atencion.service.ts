import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import {
  AtencionRequest,
  AtencionResponse,
} from '../../models/turnos/atencion.model';
import { Observable } from 'rxjs';
import { PantallaResponse } from '../../models/turnos/pantalla.model';

@Injectable({
  providedIn: 'root',
})
export class AtencionService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  saveAtention(atention: AtencionRequest): Observable<PantallaResponse> {
    const url = `${this.baseUrl}/atencion/save`;
    return this.http.post<PantallaResponse>(url, atention);
  }

  finish(atention: AtencionRequest): Observable<PantallaResponse> {
    const url = `${this.baseUrl}/atencion/finish`;
    return this.http.put<PantallaResponse>(url, atention);
  }

  getScreen(
    date: string,
    codeVentanilla: string
  ): Observable<PantallaResponse> {
    const url = `${this.baseUrl}/atencion/getScreen?date=${date}&codeVentanilla=${codeVentanilla}`;
    return this.http.get<PantallaResponse>(url);
  }
}
