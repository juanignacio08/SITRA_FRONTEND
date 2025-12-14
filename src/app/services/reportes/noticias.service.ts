import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import { Noticias, NoticiasResponse, NoticiasResponseList } from '../../models/reportes/noticias.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl + '/noticias';

  getAll(): Observable<NoticiasResponseList> {
      const url = `${this.baseUrl}/getAll`;
      return this.http.get<NoticiasResponseList>(url);
  }

  getAllActives(): Observable<NoticiasResponseList> {
      const url = `${this.baseUrl}/getAllActives`;
      return this.http.get<NoticiasResponseList>(url);
  }

  getById(noticiaId : number): Observable<NoticiasResponse> {
      const url = `${this.baseUrl}/getById?noticia=${noticiaId}`;
      return this.http.get<NoticiasResponse>(url);
  }

  save(noticia: Noticias): Observable<NoticiasResponse> {
    const url = `${this.baseUrl}/save`;
    return this.http.post<NoticiasResponse>(url, noticia);
  }

  update(noticia: Noticias): Observable<NoticiasResponse> {
    const url = `${this.baseUrl}/update`;
    return this.http.put<NoticiasResponse>(url, noticia);
  }

  delete(noticia: number): Observable<NoticiasResponse> {
    const url = `${this.baseUrl}/delete?noticia=${noticia}`;
    return this.http.delete<NoticiasResponse>(url);
  }

}
