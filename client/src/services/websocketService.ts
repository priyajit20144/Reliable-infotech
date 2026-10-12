type WebSocketEventHandler = (payload: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<WebSocketEventHandler>> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 15;
  private isExplicitlyClosed = false;
  private lastPingTime = 0;
  private latency = 0;
  private currentUser: { id?: string; role?: string } | null = null;

  constructor() {
    // Auto-connect when in browser environment
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private getWebSocketUrl(): string {
    const customApi = import.meta.env.VITE_API_URL || '';
    if (customApi.startsWith('http')) {
      const url = new URL(customApi);
      const protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${url.host}/ws`;
    }
    // Fallback: check if running on vite dev port 5173 -> connect to backend 5000
    if (window.location.port === '5173' || window.location.port === '5174') {
      return `ws://${window.location.hostname}:5000/ws`;
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  }

  public connect(user?: { id?: string; role?: string }) {
    if (user) {
      this.currentUser = user;
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      if (user) {
        this.identify(user);
      }
      return;
    }

    this.isExplicitlyClosed = false;

    try {
      const baseUrl = this.getWebSocketUrl();
      const params = new URLSearchParams();
      if (this.currentUser?.id) params.set('userId', this.currentUser.id);
      if (this.currentUser?.role) params.set('role', this.currentUser.role);

      const fullUrl = `${baseUrl}${params.toString() ? '?' + params.toString() : ''}`;
      this.ws = new WebSocket(fullUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected to real-time gateway');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.emit('STATUS_CHANGE', { connected: true, latency: this.latency });

        if (this.currentUser) {
          this.identify(this.currentUser);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'PONG') {
            this.latency = Date.now() - this.lastPingTime;
            this.emit('PONG', { latency: this.latency });
            return;
          }

          if (message.type) {
            this.emit(message.type, message.payload);
          }
        } catch (e) {
          // Non-JSON message
        }
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.emit('STATUS_CHANGE', { connected: false });
        if (!this.isExplicitlyClosed) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[WebSocket] Connection warning:', err);
      };
    } catch (err) {
      this.scheduleReconnect();
    }
  }

  public identify(user: { id?: string; role?: string }) {
    this.currentUser = user;
    this.send('IDENTIFY', { userId: user.id, role: user.role });
  }

  public send(type: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.lastPingTime = Date.now();
        this.ws.send(JSON.stringify({ type: 'PING' }));
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[WebSocket] Maximum reconnect attempts reached.');
      return;
    }

    const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 10000);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }

  public subscribe(eventType: string, handler: WebSocketEventHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    return () => {
      this.listeners.get(eventType)?.delete(handler);
    };
  }

  private emit(eventType: string, payload: any) {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(payload);
        } catch (err) {
          console.error(`[WebSocket] Error in handler for event "${eventType}":`, err);
        }
      });
    }

    // Also trigger wildcard listeners
    const wildcardHandlers = this.listeners.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => {
        try {
          handler({ type: eventType, payload });
        } catch (e) {}
      });
    }
  }

  public isConnected(): boolean {
    return Boolean(this.ws && this.ws.readyState === WebSocket.OPEN);
  }

  public getLatency(): number {
    return this.latency;
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();
