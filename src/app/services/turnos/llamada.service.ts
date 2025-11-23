import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { LlamadaRequest, LlamadaResponse } from '../../models/turnos/llamada.madel';
import { Observable } from 'rxjs';
import { PantallaResponse } from '../../models/turnos/pantalla.model';

@Injectable({
  providedIn: 'root'
})
export class LlamadaService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  saveOrderAtention(llamada: LlamadaRequest): Observable<LlamadaResponse> {
    const url = `${this.baseUrl}/llamada/save`;
    return this.http.post<LlamadaResponse>(url, llamada);
  }

  callNext(date: string, codePriority: string, codeVentanilla: string, asesorId: number): Observable<PantallaResponse> {
    const url = `${this.baseUrl}/llamada/callNext?date=${date}&codePriority=${codePriority}&codeVentanilla=${codeVentanilla}&asesorId=${asesorId}`;
    return this.http.get<PantallaResponse>(url);
  }

  markAsAbsent(llamadaId: number): Observable<PantallaResponse> {
    const url = `${this.baseUrl}/llamada/markAsAbsent?llamadaId=${llamadaId}`;
    return this.http.put<PantallaResponse>(url, null, {
      responseType: 'json'
    });
  }
}
