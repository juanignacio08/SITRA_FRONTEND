import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { PersonaResponse } from '../../models/seguridad/persona.model';
import { DniInfo } from '../../models/base/dniInfo.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;


  getPersonByDni(dni: string): Observable<PersonaResponse> {
    const url = `${this.baseUrl}/persona/getPerson/${dni}`;
    return this.http.get<PersonaResponse>(url);
  }

  getDniInfo(dni: string): Observable<DniInfo> {
    const url = `${this.baseUrl}/persona/dni/${dni}`;
    return this.http.get<DniInfo>(url);
  }

}
