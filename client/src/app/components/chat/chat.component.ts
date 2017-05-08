import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { Chatroom } from './chatroom';
import { Message } from './message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit {
  name: String = JSON.parse(localStorage.getItem('user')).name;
  username: String;
  message: String;
  roomName: String;
  currentRoom = '1';
  public chatMessages = [];
  public chatrooms = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private router: Router
  ) { }

  ngOnInit() {
    // Set the current room
    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['currentRoom']) {
        this.currentRoom = params['currentRoom'];
        console.log('current room is: ', this.currentRoom);
      }
    });
    this.chatConnect();
    this.getChatrooms();
    this.chatConnect();
    this.getMessages(this.currentRoom);
  }

  chatConnect() {
    console.log(this.name +' is now connected to the chat');
    this.chatService.chatConnect(this.name);
  }

  submitMessage() {
    const message: Message = {
      name: this.name,
      message: this.message,
      chatroom: this.currentRoom
    };
    console.log(this.name + " just send a message");
    this.chatService.submitMsg(message).subscribe();
  }

  getMessages(room) {
    this.chatService.getMessages(room)
      .subscribe(
        messages => {
          this.chatMessages = messages;
        }
      );
  }
  // Chatroom stuff goes here
  createRoom() {
    console.log('input was: ' +this.roomName);
    const newRoom: Chatroom = {
      roomname: this.roomName
    };
    this.chatService.createRoom(newRoom).subscribe();
  }

  getChatrooms() {
    this.chatService.getChatrooms()
      .subscribe(
        chatrooms => {
          this.chatrooms = chatrooms;
        }
      );
  }

  changeRoom(chatroom) {
    this.currentRoom = chatroom;
    this.chatService.changeRoom(this.currentRoom);
    this.getChatrooms();
    this.getMessages(this.currentRoom);
  }

}
