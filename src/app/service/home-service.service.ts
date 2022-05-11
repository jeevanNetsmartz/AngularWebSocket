import { Injectable } from '@angular/core';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { map, Observable, Observer, Subject } from 'rxjs';

const CHAT_URL = "ws://localhost:8000";


@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {

  private subject: AnonymousSubject<MessageEvent>;
  public messages: any;

  constructor() {
    this.messages = this.connect(CHAT_URL).pipe(
      map(
        (response) => {
          console.log(response.data);
          let data = JSON.parse(response.data)
          return data;
        }
      )
    );

    console.log(this.messages)
  }

  public connect(url): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url): AnonymousSubject<MessageEvent> {
    let ws = new WebSocket(url);
    let observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    let observer = {
      error: null,
      complete: null,
      next: (data: Object) => {
        console.log('Message sent to websocket: ', data);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable);
  }

}
