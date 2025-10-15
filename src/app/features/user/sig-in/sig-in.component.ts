import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-sig-in',
  imports: [],
  templateUrl: './sig-in.component.html',
  styleUrl: './sig-in.component.css'
})
export class SigInComponent {

  // 1. INYECTAR el objeto DOCUMENT en el constructor
  constructor(@Inject(DOCUMENT) private readonly document : Document) {}

  // 2. Crear un GETTER para el estado de la pantalla completa
  // Esto permite acceder a 'document.fullscreenElement' de forma segura en el template.
  get isFullScreen(): boolean {
    return !!this.document.fullscreenElement;
  }

  // 3. Lógica para alternar pantalla completa
  toggleFullScreen(): void {
    
    // Obtener el elemento que quieres poner en pantalla completa (por lo general, el <html>)
    const element = this.document.documentElement; 

    // Revisar el estado a través del objeto inyectado
    if (this.document.fullscreenElement) {
      // Salir de pantalla completa
      this.document.exitFullscreen().catch(err => {
        console.error(`Error al intentar salir de pantalla completa: ${err.message}`);
      });
    } else {
      // Entrar en pantalla completa
      element.requestFullscreen().catch(err => {
        console.error(`Error al intentar entrar a pantalla completa: ${err.message}`);
      });
    }
  }

}
