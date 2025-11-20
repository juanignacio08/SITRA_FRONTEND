import { Pipe, PipeTransform } from '@angular/core';
import { TablaMaestraEstadosOrdenAtencion } from '../models/maestros/tablaMaestra.model';

@Pipe({
  name: 'viewIconStatusOrdenAtention'
})
export class ViewIconStatusOrdenAtentionPipe implements PipeTransform {

  transform(status: string): string {
      switch (status) {
        case TablaMaestraEstadosOrdenAtencion.PENDIENTE:
          return 'Pendiente';
        case TablaMaestraEstadosOrdenAtencion.EN_LLAMADA:
          return "bi bi-telephone-plus-fill";
        case TablaMaestraEstadosOrdenAtencion.ATENDIDO:
          return "Atendido";
        case TablaMaestraEstadosOrdenAtencion.AUSENTE:
          return "Ausente";
        case TablaMaestraEstadosOrdenAtencion.ATENDIENDO:
          return "Atendiendo";
        default:
          return "Desconocido";
      }
    }

}
