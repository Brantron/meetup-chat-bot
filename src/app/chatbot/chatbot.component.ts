import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const dialogflowURL = 'https://dialogflow.googleapis.com/v2/projects/agent-name-pdnwdr/agent/sessions/50cc1f75-1e97-aee0-0cb5-ac991c73dea2:detectIntent';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})

export class ChatbotComponent implements OnInit {

  messages = [];
  loading = false;

  // Random ID to maintain session with server
  sessionId = Math.random().toString(36).slice(-5);

  constructor(private http: HttpClient) { }

  ngOnInit() {
    console.log('we inited')
    this.addBotMessage('Human presence detected 🤖. How can I help you? ');
  }

  handleUserMessage(event) {
    console.log(event);
    const text = event.message;
    this.addUserMessage(text);

    this.loading = true;

    // Make the request
    this.http.post<any>(
      dialogflowURL,
      {
        queryInput: {
          text: {
            text,
            languageCode: 'en-US'
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ya29.c.Elp1B0LygJkCEe1U_qHCV0WXGmTJPwrVrTYpCd9C6VIiuKo5TORkZUJZCOBayAx2jA0yGq2NkEv1X_xKTiStLH9YUGozPaHKH9WMkg0vfjXWK2WoELguAkyGrG0`,
        }
      }
    )
    .subscribe(res => {
      if(res.queryResult && res.queryResult.fulfillmentText) {
        this.addBotMessage(res.queryResult.fulfillmentText);
      }
      this.loading = false;
    });
  }

  addUserMessage(text) {
    this.messages.push({
      text,
      sender: 'You',
      reply: true,
      date: new Date()
    });
  }

  addBotMessage(text) {
    this.messages.push({
      text,
      sender: 'Bot',
      avatar: '/assets/bot.jpeg',
      date: new Date()
    });
  }

}
