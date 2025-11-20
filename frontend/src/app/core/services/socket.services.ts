import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';

interface User {
  userId: string;
  username: string;
  socketId: string;
}

interface CursorPosition {
  line: number;
  column: number;
}

interface CursorData {
  userId: string;
  username: string;
  cursor: CursorPosition;
  selection?: any;
}

interface ContentUpdate {
  changeId: string;
  userId: string;
  fileId: string;
  changes: any;
  fullContent?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private isConnected = false;

  // Real-time events observables
  public onUserJoined = new Subject<User>();
  public onUserLeft = new Subject<string>();
  public onCursorUpdate = new Subject<CursorData>();
  public onContentUpdate = new Subject<ContentUpdate>();
  public onPresenceUpdate = new Subject<any>();

  constructor() {
    this.socket = io(environment.baseUrl, {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('✅ Connected to collaboration server : ', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      console.log('❌ Disconnected from collaboration server', reason);
    });

    // User events
    this.socket.on('user-joined', (user: User) => {
      console.log('👥 USER JOINED EVENT:', user);
      this.onUserJoined.next(user);
    });

    // Cursor events
    this.socket.on('cursor-update', (data: CursorData) => {
      this.onCursorUpdate.next(data);
    });

    // Content events
    this.socket.on('content-update', (data: ContentUpdate) => {
      this.onContentUpdate.next(data);
    });

    // Presence events
    this.socket.on('presence-update', (data: any) => {
      this.onPresenceUpdate.next(data);
    });
  }

  // Join project room
  joinProject(projectId: string, userId: string, username: string): void {
    this.socket.emit('join-project', { projectId, userId, username });
  }

  // Leave project room
  leaveProject(projectId: string): void {
    this.socket.emit('leave-project', { projectId });
  }

  // Send cursor position
  sendCursorMove(cursor: CursorPosition, selection?: any): void {
    if (!this.isConnected) {
      console.warn('⚠️ Socket not connected, cannot send cursor move');
      return;
    }

    console.log('📤 Sending cursor move:', cursor);
    this.socket.emit('cursor-move', { cursor, selection });
  }

  // Send content changes
  sendContentChange(fileId: string, changes: any, fullContent?: string): void {
    this.socket.emit('content-change', { fileId, changes, fullContent });
  }

  // Presence events
  sendUserOnline(): void {
    this.socket.emit('user-online');
  }

  sendUserTyping(): void {
    this.socket.emit('user-typing');
  }

  sendUserStopTyping(): void {
    this.socket.emit('user-stop-typing');
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  disconnect(): void {
    this.socket.disconnect();
  }
}
