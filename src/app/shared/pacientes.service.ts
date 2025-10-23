// src/app/shared/pacientes.service.ts
import { Injectable } from '@angular/core';

export interface Paciente {
  ordenAtencion: string;
  nombre: string;
  numeroDocumento: string;
  llamadas: number;
  estado: string;
  llamando: boolean;
  horaInicio?: string;
  horaFin?: string;
  ventanilla?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  pacientes: Paciente[] = [];       // Lista de pacientes en espera
  historial: Paciente[] = [];       // Historial de atenciones

  private turno = 1;                // Para asignar orden automática

  constructor() {}

  // ➕ Agregar paciente nuevo
  agregarPaciente(nombre: string, numeroDocumento: string) {
    const nuevoPaciente: Paciente = {
      ordenAtencion: this.turno.toString(),
      nombre,
      numeroDocumento,
      llamadas: 0,
      estado: 'Pendiente',
      llamando: false
    };
    this.turno++;
    this.pacientes.push(nuevoPaciente);
  }

  // 📞 Llamar paciente
  llamarPaciente(p: Paciente) {
    p.llamando = true;
    p.estado = 'Llamando';
    p.horaInicio = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    p.llamadas += 1;
  }

  // ✅ Finalizar paciente: lo mueve a historial
  finalizarPaciente(p: Paciente, ventanilla: string = '1') {
    p.llamando = false;
    p.estado = 'Atendido';
    p.horaFin = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const registro: Paciente = { ...p, ventanilla, estado: 'Completado' };
    this.historial.push(registro);

    // Eliminar paciente de la lista principal
    this.pacientes = this.pacientes.filter(paciente => paciente.ordenAtencion !== p.ordenAtencion);
  }

  // ❌ Marcar paciente como ausente
  marcarAusente(p: Paciente, ventanilla: string = '1') {
    p.llamando = false;
    p.horaFin = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const registro: Paciente = { ...p, ventanilla, estado: 'Ausente' };
    this.historial.push(registro);

    this.pacientes = this.pacientes.filter(paciente => paciente.ordenAtencion !== p.ordenAtencion);
  }
}
