import { Pipe, PipeTransform } from '@angular/core';
import { TablaMaestraVentanillas } from '../models/maestros/tablaMaestra.model';

@Pipe({
  name: 'viewVentanilla'
})
export class ViewVentanillaPipe implements PipeTransform {

  transform(ventanilla: string): string {
      switch (ventanilla) {
        case TablaMaestraVentanillas.VENTANILLA_1:
          return 'V 01';
        case TablaMaestraVentanillas.VENTANILLA_2:
          return 'V 02';
        default:
          return "Desconocido";
      }
    }

}
