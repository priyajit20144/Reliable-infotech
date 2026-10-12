import { WebSocketServer, WebSocket } from 'ws';
import type { Server as HTTPServer } from 'http';
import url from 'url';

interface ConnectedClient {
  ws: WebSocket;
  userId?: string;
  role?: string;
  ip?: string;
  isAlive: boolean;
  connectedAt: Date;
}

const clients = new Set<ConnectedClient>();
let wssInstance: WebSocketServer | null = null;
let heartbeatInterval: NodeJS.Timeout | null = null;

/**
 * Initialize WebSocket Server attached to the HTTP server
 */
export const initWebSocketServer = (httpServer: HTTPServer): WebSocketServer => {
  if (wssInstance) {
    return wssInstance;
  }

  const wss = new WebSocketServer({
    noServer: false,
    server: httpServer,
    path: '/ws',
  });

  wssInstance = wss;

  wss.on('connection', (ws: WebSocket, req) => {
    // Parse query params for client identification: /ws?userId=...&role=...
    const parsedUrl = url.parse(req.url || '', true);
    const userId = (parsedUrl.query.userId as string) || undefined;
    const role = (parsedUrl.query.role as string) || 'GUEST';
    const ip = req.socket.remoteAddress;

    const client: ConnectedClient = {
      ws,
      userId,
      role,
      ip,
      isAlive: true,
      connectedAt: new Date(),
    };

    clients.add(client);
    console.log(`[WebSocket] Client connected (Total: ${clients.size}) | User: ${userId || 'guest'} | Role: ${role}`);

    // Send welcome / initial handshake acknowledgement
    try {
      ws.send(
        JSON.stringify({
          type: 'CONNECTED',
          payload: {
            status: 'online',
            serverTime: new Date().toISOString(),
            totalActiveClients: clients.size,
          },
        })
      );
    } catch (e) {}

    // Handle incoming client messages / ping
    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'PING') {
          client.isAlive = true;
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
          return;
        }

        if (message.type === 'IDENTIFY') {
          if (message.userId) client.userId = message.userId;
          if (message.role) client.role = message.role;
          console.log(`[WebSocket] Client identified as ${client.userId} (${client.role})`);
        }
      } catch (err) {
        // Non-JSON or raw text
      }
    });

    ws.on('pong', () => {
      client.isAlive = true;
    });

    ws.on('close', () => {
      clients.delete(client);
      console.log(`[WebSocket] Client disconnected (Remaining: ${clients.size})`);
    });

    ws.on('error', (err) => {
      console.warn(`[WebSocket] Client error:`, err.message);
      clients.delete(client);
    });
  });

  // Setup 30s heartbeat to purge dead sockets
  if (!heartbeatInterval) {
    heartbeatInterval = setInterval(() => {
      for (const client of clients) {
        if (!client.isAlive) {
          try {
            client.ws.terminate();
          } catch (e) {}
          clients.delete(client);
          continue;
        }
        client.isAlive = false;
        try {
          client.ws.ping();
        } catch (e) {
          clients.delete(client);
        }
      }
    }, 30000);
  }

  return wss;
};

/**
 * Broadcast event to all active clients
 */
export const broadcast = (type: string, payload: any) => {
  const data = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
  for (const client of clients) {
    if (client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(data);
      } catch (e) {}
    }
  }
};

/**
 * Broadcast event to a specific user
 */
export const broadcastToUser = (userId: string, type: string, payload: any) => {
  const data = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
  for (const client of clients) {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(data);
      } catch (e) {}
    }
  }
};

/**
 * Broadcast event to specific role (e.g. 'ADMIN')
 */
export const broadcastToRole = (role: string, type: string, payload: any) => {
  const data = JSON.stringify({ type, payload, timestamp: new Date().toISOString() });
  for (const client of clients) {
    if (
      (client.role === role || (role === 'ADMIN' && client.role === 'TEAM_MEMBER')) &&
      client.ws.readyState === WebSocket.OPEN
    ) {
      try {
        client.ws.send(data);
      } catch (e) {}
    }
  }
};

// Event Notification Dispatches
export const notifyNewMessage = (messageData: any) => {
  // Broadcast to target conversation participants and admins
  broadcast('NEW_MESSAGE', messageData);
};

export const notifyNewNotification = (notificationData: any) => {
  if (notificationData.userId) {
    broadcastToUser(notificationData.userId, 'NEW_NOTIFICATION', notificationData);
  } else {
    broadcast('NEW_NOTIFICATION', notificationData);
  }
};

export const notifyNewRequest = (requestData: any) => {
  broadcastToRole('ADMIN', 'NEW_CUSTOM_REQUEST', requestData);
  broadcast('NEW_CUSTOM_REQUEST', requestData);
};

export const notifyNewInquiry = (inquiryData: any) => {
  broadcastToRole('ADMIN', 'NEW_PROJECT_INQUIRY', inquiryData);
};

export const getWebSocketStats = () => {
  return {
    activeConnections: clients.size,
    clientsList: Array.from(clients).map((c) => ({
      userId: c.userId || 'guest',
      role: c.role || 'GUEST',
      connectedAt: c.connectedAt,
    })),
  };
};
