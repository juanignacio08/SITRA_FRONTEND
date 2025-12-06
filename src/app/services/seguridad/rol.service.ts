import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { RolResponseList } from '../../models/seguridad/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/rol';

  getRols(): Observable<RolResponseList> {
    const url = `${this.baseUrl}/getRols`;
    return this.http.get<RolResponseList>(url);
  }
}
