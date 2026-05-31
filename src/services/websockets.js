import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WS_URL =
  import.meta.env.VITE_WS_URL ||
  'http://localhost:8080/ws';

class WebSocketService {

  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect(onMessage) {

    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const socket = new SockJS(WS_URL);

    this.client = new Client({

      webSocketFactory: () => socket,

      reconnectDelay: 5000,

      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      debug: (str) => {
        console.log('[WS]', str);
      },

      onConnect: () => {

        console.log('Connected to WebSocket');
        this.connected = true;

        // Subscribe to topic
        this.client.subscribe(

          '/topic/live-bus',

          (message) => {

            try {
              const data = JSON.parse(message.body);
              console.log('Received bus location:', data);
              onMessage(data);
            } catch (error) {
              console.error('Error parsing WebSocket message:', error);
            }
          }
        );
      },

      onStompError: (frame) => {

        console.error('STOMP Error:', frame);
        this.connected = false;
      },

      onWebSocketError: (error) => {

        console.error('WebSocket Error:', error);
        this.connected = false;
      },

      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.connected = false;
      }
    });

    this.client.activate();
  }

  disconnect() {

    if (this.client && this.connected) {

      this.client.deactivate();
      this.connected = false;

      console.log('WebSocket disconnected');
    }
  }

  sendLocation(data) {

    if (this.client && this.connected) {

      try {
        this.client.publish({

          destination: '/app/bus-location',
          body: JSON.stringify(data),
        });

        console.log('Location sent:', data);
      } catch (error) {
        console.error('Error sending location:', error);
      }
    } else {
      console.warn('WebSocket not connected, cannot send location');
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const wsService =
  new WebSocketService();