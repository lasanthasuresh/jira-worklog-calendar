import { Component, OnInit } from '@angular/core';
import { AccountInfo } from './account-info';

@Component ({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {

  loggedInUser: AccountInfo;

  ngOnInit () {
  }

  onUserLoggedIn ($event: AccountInfo) {
    this.loggedInUser = $event;
  }

  onUserLoggOff ($event: any) {
    this.loggedInUser = null;
  }
}
