import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Message } from './message';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  messages: Message[];
  messageText: string;
  newMassage: string;

  ngOnInit(): void {
    this.dashboardService.get().subscribe(
      data => this.messages = data,
      () => console.log("Problems with get request")
    );
  }

  createMessage() {
    if(this.newMassage.length == 0)
      return;

    this.dashboardService.post(this.newMassage).subscribe(
      data => this.messages.push(data),
      () => console.log("Problems with post request"),
      () => this.newMassage = ""
    );
  }

  deleteMessage(msgId) {  
    this.dashboardService.delete(msgId).subscribe(
      () => this.messages = this.messages.filter(m => m.id != msgId),
      () => console.log("Problems with delete request")
    );
  }

  changeMessage(msgId: number) {
    if(this.messages.filter(m => m.isEditing).length != 0)
      alert("You can't edit several messages at the same time");
    else {
      let msg = this.messages.find(m => m.id == msgId);
      this.messageText = msg.msg;
      msg.isEditing = true;
    }
  }

  changeConfirm(msgId: number){
    let msg = this.messages.find(m => m.id == msgId);
    this.dashboardService.put( msgId, this.messageText).subscribe(
      data => msg.msg = data.msg,
      () => console.log("Problem with put request"),
      () => {
        msg.isEditing = false;
        this.messageText = "";
      }
    );
  }
  
  changeCancel(msgId: number){
    let msg = this.messages.find(m => m.id == msgId);
    msg.isEditing = false;
    this.messageText = "";
  }
}
