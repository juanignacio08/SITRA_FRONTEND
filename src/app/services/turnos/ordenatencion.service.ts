import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { OrdenAtencion, OrdenAtencionPaginatedResponse, OrdenAtencionRequest, OrdenAtencionResponse } from '../../models/turnos/ordenatencion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrdenatencionService {
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  saveOrderAtention(orderAtention: OrdenAtencionRequest): Observable<OrdenAtencionResponse> {
    const url = `${this.baseUrl}/ordenAtencion/save`;
    return this.http.post<OrdenAtencionResponse>(url, orderAtention);
  }

  getNormalPaginatedOrders(page: number, size: number, date: string): Observable<OrdenAtencionPaginatedResponse> {
    const url = `${this.baseUrl}/ordenAtencion/getNormalPaginated?page=${page}&size=${size}&date=${date}`;
    return this.http.get<OrdenAtencionPaginatedResponse>(url);
  }

  getPreferentialPaginatedOrders(page: number, size: number, date: string): Observable<OrdenAtencionPaginatedResponse> {
    const url = `${this.baseUrl}/ordenAtencion/getPreferentialPaginated?page=${page}&size=${size}&date=${date}`;
    return this.http.get<OrdenAtencionPaginatedResponse>(url);
  }
}
