import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {Message} from '../components/chat/message';
import {Chatroom} from '../components/chat/chatroom';


@Injectable()
export class ChatService {
  private url = window.location.origin;
  private socket = io(this.url);
  private postUrl = 'http://localhost:1337/chat/send-msg';
  private chatRoomUrl = 'http://localhost:1337/chat/new-chatroom';

  constructor(
    private http: Http
  ) { }

  submitMsg(message: Message){
    const headers = new Headers();
    headers.append('Content-type', 'application/json');
    return this.http.post(this.postUrl, message, {headers: headers})
      .map(res => res.json());
  }

  getMessages(room): Observable<Message[]>{
    let observable = new Observable(observer => {
      this.socket.emit('send current room', room);
      this.socket.on('refresh messages', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  createRoom(room){
    const headers = new Headers();
    headers.append('Content-type', 'application/json');
    return this.http.post(this.chatRoomUrl, room, {headers: headers})
      .map(res => res.json());
  }

  getChatrooms(): Observable<Chatroom[]>{
    const chatroomsList = new Observable(observer => {
      this.socket.on('refresh chatrooms', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });
    return chatroomsList;
  }

  changeRoom(newRoom){
    this.socket.emit('change room', newRoom);
  }

  chatConnect(username){
    this.socket.emit('connect to chat', username);
  }


}
