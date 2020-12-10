import {
  Injectable,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';

@Injectable()
export class SocketService implements OnDestroy{
  private host = 'http://localhost:1986';
  private socket: any;

  constructor() {
    this.socket = io.connect(this.host);
    this.socket.on('connect', () => this.onConnect());
    this.socket.on('disconnect', () => this.onDisconnect());
    this.socket.on('error', (error: string) => {
      console.log(`ERROR: "${error}" (${this.host})`);
    });
  }

  connect() {
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  emit(chanel, message) {
    return new Observable<any>(observer => {
      console.log(`emit to ${chanel}:`, message);
      this.socket.emit(chanel, message, (data) => {
        if (data.success) {
          observer.next(data.msg);
        } else {
          observer.error(data.msg);
        }
        observer.complete();
      });
    });
  }

  on(eventName) {
    console.log(`listen to ${eventName}:`);
    return new Observable<any>(observer => {
      this.socket.off(eventName);
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });
    });
  }

  private onConnect() {
    console.log('Connected');
  }

  private onDisconnect() {
    console.log('Disconnected');
  }

  ngOnDestroy() {
    this.socket.disconnect();
  }

  sendMessage(message) {
      this.socket.emit('new_message', {message});
    }

  setUser(username) {
      this.socket.emit('change_username', {username});
    }
}
