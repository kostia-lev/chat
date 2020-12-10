import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { USERNAME } from '../../constants';
import { LocalstorageService } from '../localstorage.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.scss'],
  // provider is here to make it non singleton, it will be destroyed after
  providers: [SocketService]
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(public socketService: SocketService, public localstorageService: LocalstorageService) {}
  public messages: { message: string,
    userId: number,
    userName: string,
    time: object
  }[] = [];
  public storedUsername = '';
  public currentUserName = 'Anonymous';
  public users = {};
  public currentMessageText = '';
  private notifier = new Subject();

  ngOnInit() {
    this.storedUsername = this.localstorageService.getItem(USERNAME);
    if (this.storedUsername) {
      this.setUsername(this.storedUsername);
    }
    this.socketService.on('new_message')
      .pipe(takeUntil(this.notifier))
      .subscribe((messageObj) => {
        this.messages.push({
          ...messageObj,
          time: new Date()
        });
      });
    this.socketService.on('users_change')
      .pipe(takeUntil(this.notifier))
      .subscribe((users) => {
        this.users = users;
      });
  }

  sendMessage() {
    this.socketService.sendMessage(this.currentMessageText);
    this.currentMessageText = '';
  }

  setMsgInputVal(val) {
    this.currentMessageText = val;
  }

  setUsername(val) {
    this.currentUserName = val;
    this.localstorageService.setItem(USERNAME, val);
    this.socketService.setUser(val);
  }

  ngOnDestroy() {
    this.notifier.next();
    this.notifier.complete();
  }
}
