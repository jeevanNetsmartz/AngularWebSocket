import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { HomeServiceService } from 'src/app/service/home-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  messageText: string = '';
  messages: Array<any> = [];
  socket: any;
  title = 'socketrv';
  content = '';
  received = [];
  sent = [];

  constructor(private WebsocketService: HomeServiceService) {

  }

  ngOnInit() {
    this.WebsocketService.messages.subscribe(msg => {
      this.received.push(msg);
      console.log("Response from websocket: " + msg);
    });
  }


}
