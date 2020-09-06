import { Component, OnInit } from '@angular/core';

import {
  Account, NetworkType, TransferTransaction, Deadline, EmptyMessage, SignedTransaction, RepositoryFactoryHttp, IListener, NewBlock
} from 'symbol-sdk'
import {
  from, Observable
} from "rxjs"
import {
  concatMap, tap
} from "rxjs/operators"


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my-app-with-nem';
  account: Account
  signedTx: SignedTransaction
  listener: IListener
  newBlock$: Observable<NewBlock>

  ngOnInit() {
    const gatewayURL = "http://api-01.ap-northeast-1.096x.symboldev.network:3000"
    const repositoryFactory = new RepositoryFactoryHttp(
      gatewayURL, {
        networkType: NetworkType.TEST_NET,
        websocketInjected: window.WebSocket,
        websocketUrl: gatewayURL.replace("http", "ws") + "/ws"
      }
    );
    this.listener = repositoryFactory.createListener()

    this.startToMonitorNewBlock()
  }

  generateNewAccount() {
    this.account = Account.generateNewAccount(NetworkType.TEST_NET)
  }

  createTransaction() {
    const tx = TransferTransaction.create(
      Deadline.create(),
      this.account.address,
      [],
      EmptyMessage,
      NetworkType.TEST_NET
    ).setMaxFee(500) as TransferTransaction
    this.signedTx = this.account.sign(tx, "693A04094232B8E1BA275798095B8C7170406BDEEA85B301E9B9B72C1907DC24")
  }

  startToMonitorNewBlock() {
    this.newBlock$ = from(this.listener.open())
      .pipe(
        concatMap(() => this.listener.newBlock()),
      )
  }
}
