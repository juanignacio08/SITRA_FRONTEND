// src/app/services/turnos/orden-atencion-socket.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';

// Declaraciones para evitar problemas de TypeScript
declare const SockJS: any;
declare const Stomp: any;

@Injectable({
  providedIn: 'root'
})
export class OrdenAtencionSocketService {
  private stompClient: any;
  private connected = false;
  private nuevasOrdenesSubject = new BehaviorSubject<any>(null);
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
      this.loadScript('https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js', 
        () => this.loadStompAndConnect());
    }
  }

  private loadStompAndConnect(): void {
    console.log('📥 Cargando Stomp desde CDN...');
    this.loadScript('https://cdn.jsdelivr.net/npm/stompjs@2/lib/stomp.min.js', 
      () => this.connectWebSocket());
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
      console.log('🔗 Conectando a:', socketUrl);
      
      const socket = new SockJS(socketUrl);
      this.stompClient = Stomp.over(socket);
      
      // Configurar reconexión automática
      this.stompClient.reconnect_delay = 5000;
      
      // Conectar
      this.stompClient.connect({},
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
      this.stompClient.subscribe('/topic/nuevas-ordenes',
        (message: any) => {
          console.log('📨 MENSAJE CRUDO del backend:', message);
          
          if (message.body) {
            try {
              const nuevaOrden = JSON.parse(message.body);
              console.log('🎯🎯🎯 ORDEN REAL del backend:', nuevaOrden);
              this.nuevasOrdenesSubject.next(nuevaOrden);
            } catch (e) {
              console.error('❌ Error parseando JSON:', e, message.body);
            }
          }
        }
      );
      console.log('👂 Suscrito a /topic/nuevas-ordenes');
    }
  }

  // Observable para componentes (MISMO que antes)
  getNuevasOrdenesObservable(): Observable<OrdenAtencion> {
    return this.nuevasOrdenesSubject.asObservable();
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

  // Método para pruebas manuales (igual que antes)
  testEnviarOrden(): void {
    const testOrder = {
      ordenAtencionId: Date.now(),
      turno: Math.floor(Math.random() * 50),
      persona: {
        nombres: 'TEST',
        apellidoPaterno: 'CONSOLA'
      },
      timestamp: new Date().toLocaleTimeString(),
      mensaje: 'Prueba desde consola'
    };
    console.log('🎮 [TEST] Enviando desde consola:', testOrder);
    this.nuevasOrdenesSubject.next(testOrder);
  }
}