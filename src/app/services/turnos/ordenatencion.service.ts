import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { OrdenAtencionListProjectionResponse, OrdenAtencionListResponse, OrdenAtencionPaginatedResponse, OrdenAtencionRequest, OrdenAtencionResponse } from '../../models/turnos/ordenatencion.model';
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

  updateOrderAtention(orderAtention: OrdenAtencionRequest): Observable<OrdenAtencionResponse> {
    const url = `${this.baseUrl}/ordenAtencion/update`;
    return this.http.put<OrdenAtencionResponse>(url, orderAtention);
  }

  getRecordByDate(date: string): Observable<OrdenAtencionListProjectionResponse> {
    const url = `${this.baseUrl}/ordenAtencion/getRecordByDate?date=${date}`;
    return this.http.get<OrdenAtencionListProjectionResponse>(url);
  }

  getRecordByAsesorAndDate(asesorId: number, date: string): Observable<OrdenAtencionListProjectionResponse> {
    const url = `${this.baseUrl}/ordenAtencion/getRecordByAsesorAndDate?asesorId=${asesorId}&date=${date}`;
    return this.http.get<OrdenAtencionListProjectionResponse>(url);
  }

  getLisByDateAndReceptor(date: string, receptor: number): Observable<OrdenAtencionListResponse> {
    const url = `${this.baseUrl}/ordenAtencion/getByDateAndReceptor?date=${date}&receptor=${receptor}`;
    return this.http.get<OrdenAtencionListResponse>(url);
  }

  getLisByDate(date: string): Observable<OrdenAtencionListResponse> {
    const url = `${this.baseUrl}/ordenAtencion/getByDate?date=${date}`;
    return this.http.get<OrdenAtencionListResponse>(url);
  }
  
}
