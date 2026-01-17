// src/app/services/turnos/orden-atencion-socket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';
import { Pantalla } from '../../models/turnos/pantalla.model';
import { Noticias } from '../../models/reportes/noticias.model';

// Declaraciones para evitar problemas de TypeScript
declare const SockJS: any;
declare const Stomp: any;

@Injectable({
  providedIn: 'root',
})
export class OrdenAtencionSocketService {
  private stompClient: any;
  private connected = false;
  private nuevasOrdenesSubject = new BehaviorSubject<OrdenAtencion | null>(null);
  private nuevaLlamadaSubject = new BehaviorSubject<Pantalla | null>(null);
  private nuevaAtencionSubject = new BehaviorSubject<Pantalla | null>(null);
  private finalizarAtencionSubject = new BehaviorSubject<Pantalla | null>(null);
  private nuevaAusenciaSubject = new BehaviorSubject<Pantalla | null>(null);
  private nuevaNoticiaSubject = new BehaviorSubject<Noticias | null>(null);
  private editarNoticiaSubject = new BehaviorSubject<Noticias | null>(null);
  private eliminarNoticiaSubject = new BehaviorSubject<Noticias | null>(null);

  private reconnectInterval: any;

  constructor() {
    console.log('🔌 Iniciando WebSocket REAL...');
    this.loadDependenciesAndConnect();
  }

  private loadDependenciesAndConnect(): void {
    // Verificar si SockJS ya está cargado
    if (typeof window !== 'undefined' && (window as any).SockJS) {
      console.log('✅ SockJS ya está cargado');
      this.connectWebSocket();
    } else {
      console.log('📥 Cargando SockJS desde CDN...');
      this.loadScript(
        'https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js',
        () => this.loadStompAndConnect()
      );
    }
  }

  private loadStompAndConnect(): void {
    console.log('📥 Cargando Stomp desde CDN...');
    this.loadScript(
      'https://cdn.jsdelivr.net/npm/stompjs@2/lib/stomp.min.js',
      () => this.connectWebSocket()
    );
  }

  private loadScript(src: string, callback: () => void): void {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.onload = callback;
    document.head.appendChild(script);
  }

  private connectWebSocket(): void {
    try {
      // URL EXACTA que usa Spring Boot con SockJS
      const socketUrl = 'http://localhost:8080/sitra/api/v1/ws';
      //const socketUrl = 'http://192.168.18.41:8080/sitra/api/v1/ws';
      console.log('🔗 Conectando a:', socketUrl);

      const socket = new SockJS(socketUrl);
      this.stompClient = Stomp.over(socket);

      // Configurar reconexión automática
      this.stompClient.reconnect_delay = 5000;

      // Conectar
      this.stompClient.connect(
        {},
        // On Connect
        (frame: any) => {
          console.log('✅✅✅ CONECTADO AL BACKEND REAL', frame);
          this.connected = true;
          this.subscribeToTopics();
        },
        // On Error
        (error: any) => {
          console.error('❌❌❌ ERROR de conexión:', error);
          this.connected = false;
          this.scheduleReconnect();
        }
      );
    } catch (error) {
      console.error('❌ Error al conectar:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
    this.reconnectInterval = setTimeout(() => {
      console.log('🔄 Intentando reconectar...');
      this.connectWebSocket();
    }, 5000);
  }

  private subscribeToTopics(): void {
    if (this.stompClient && this.connected) {
      // 🔔 NUEVAS ÓRDENES
      this.stompClient.subscribe('/topic/nuevas-ordenes', (message: any) => {
        if (message.body) {
          try {
            const nuevaOrden = JSON.parse(message.body);
            console.log('🎯🎯🎯 ORDEN REAL del backend:', nuevaOrden);
            this.nuevasOrdenesSubject.next(nuevaOrden);
          } catch (e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/nuevas-ordenes');

      // 🔔 NUEVA LLAMADA
      this.stompClient.subscribe('/topic/nueva-llamada', (message: any) => {
        if (message.body) {
          try {
            const nuevaLlamada = JSON.parse(message.body);
            console.log('📢 LLAMADA:', nuevaLlamada);
            this.nuevaLlamadaSubject.next(nuevaLlamada);
          } catch(e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/nueva-llamada');

      // 🔔 NUEVA ATENCION
      this.stompClient.subscribe('/topic/nueva-atencion', (message: any) => {
        if (message.body) {
          try {
            const nuevaAtencion = JSON.parse(message.body);
            console.log('ATENCION:', nuevaAtencion);
            this.nuevaAtencionSubject.next(nuevaAtencion);
          } catch(e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/nueva-atencion');

      // 🔔 FINALIZAR ATENCION
      this.stompClient.subscribe('/topic/finalizar-atencion', (message: any) => {
        if (message.body) {
          try {
            const nuevaAtencion = JSON.parse(message.body);
            console.log('ATENCION:', nuevaAtencion);
            this.finalizarAtencionSubject.next(nuevaAtencion);
          } catch(e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/finalizar-atencion');

      // 🔔 NUEVA AUSENCIA
      this.stompClient.subscribe('/topic/nueva-ausencia', (message: any) => {
        if (message.body) {
          try {
            const nuevaAusencia = JSON.parse(message.body);
            console.log('AUSENCIA:', nuevaAusencia);
            this.nuevaAusenciaSubject.next(nuevaAusencia);
          } catch(e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/nueva-ausencia');

      // 🔔 NUEVA NOTICIA
      this.stompClient.subscribe('/topic/nueva-noticia', (message: any) => {
        if (message.body) {
          try {
            const nuevaNoticia = JSON.parse(message.body);
            console.log('Noticia:', nuevaNoticia);
            this.nuevaNoticiaSubject.next(nuevaNoticia);
          } catch(e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/nueva-noticia');

      // 🔔 EDITAR NOTICIA
      this.stompClient.subscribe('/topic/noticia-edicion', (message: any) => {
        if (message.body) {
          try {
            const nuevaNoticia = JSON.parse(message.body);
            console.log('Noticia:', nuevaNoticia);
            this.editarNoticiaSubject.next(nuevaNoticia);
          } catch(e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/editar-noticia');

      // 🔔 ELIMINAR NOTICIA
      this.stompClient.subscribe('/topic/noticia-eliminada', (message: any) => {
        if (message.body) {
          try {
            const nuevaNoticia = JSON.parse(message.body);
            console.log('Noticia:', nuevaNoticia);
            this.eliminarNoticiaSubject.next(nuevaNoticia);
          } catch(e) {
            console.error('❌ Error parseando JSON:', e, message.body);
          }
        }
      });
      console.log('👂 Suscrito a /topic/eliminar-noticia');
    }
  }

  getNuevasOrdenesObservable(): Observable<OrdenAtencion | null> {
    return this.nuevasOrdenesSubject.asObservable();
  }

  getNuevaLlamadaObservable(): Observable<Pantalla | null> {
    return this.nuevaLlamadaSubject.asObservable();
  }

  getNuevaAtencionObservable(): Observable<Pantalla | null> {
    return this.nuevaAtencionSubject.asObservable();
  }

  getFinalizarAtencionObservable(): Observable<Pantalla | null> {
    return this.finalizarAtencionSubject.asObservable();
  }

  getNuevaAusenciaObservable(): Observable<Pantalla | null> {
    return this.nuevaAusenciaSubject.asObservable();
  }

  getNuevaNoticiaObservable(): Observable<Noticias | null> {
    return this.nuevaNoticiaSubject.asObservable();
  }

  getEditarNoticiaObservable(): Observable<Noticias | null> {
    return this.editarNoticiaSubject.asObservable();
  }

  getEliminarNoticiaObservable(): Observable<Noticias | null> {
    return this.eliminarNoticiaSubject.asObservable();
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
      this.connected = false;
    }
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
  }
}
