import { Component, OnInit } from '@angular/core';

import {
  Account, NetworkType
} from 'symbol-sdk'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my-app-with-nem';
  account: Account

  ngOnInit() {
    this.generateNewAccount()
  }

  generateNewAccount() {
    this.account = Account.generateNewAccount(NetworkType.TEST_NET)
  }
}
