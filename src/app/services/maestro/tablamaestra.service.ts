import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { TablaMaestra, TablaMaestraListResponse, TablaMaestraResponse } from '../../models/maestros/tablaMaestra.model';

@Injectable({
  providedIn: 'root'
})
export class TablamaestraService {

  codeTableDocumentType: string = '004'; // Código para Tipo de Documento
  codeTablePreferential: string = '001'; // Código para Tipo de Preferencial
  codeTableOrderAtentionStatus: string = '002'; // Código para Estado de Orden de Atención
  codeTableVentanilla: string = '003'; // Código para Ventanilla
  
  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;

  getItemsTable(codeTable: string): Observable<TablaMaestraListResponse> {
    const url = `${this.baseUrl}/tablamaestra/getItems/${codeTable}`;
    return this.http.get<TablaMaestraListResponse>(url);
  }
}
