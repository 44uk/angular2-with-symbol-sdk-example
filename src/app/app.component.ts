import { Component, OnInit } from '@angular/core';

import {
  Account, NetworkType
} from 'nem2-sdk'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my-app-with-nem';
  account: Account

  ngOnInit() {
    this.account = Account.generateNewAccount(NetworkType.MIJIN_TEST)
  }
}
