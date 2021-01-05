import { Component, OnInit } from '@angular/core';

import {
  Account, NetworkType, TransferTransaction, Deadline, EmptyMessage, SignedTransaction, RepositoryFactoryHttp, IListener, NewBlock
} from 'symbol-sdk'
import {
  forkJoin,
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

  repo: RepositoryFactoryHttp
  listener: IListener
  newBlock$: Observable<NewBlock>

  private gatewayURL = "http://api-01.ap-northeast-1.0.10.0.x.symboldev.network:3000"

  ngOnInit() {
    const repositoryFactory = new RepositoryFactoryHttp(
      this.gatewayURL, {
        networkType: NetworkType.TEST_NET,
        websocketInjected: window.WebSocket,
        websocketUrl: this.gatewayURL.replace("http", "ws") + "/ws"
      }
    );
    this.repo = repositoryFactory
    this.listener = this.repo.createListener()

    this.startToMonitorNewBlock()
  }

  generateNewAccount() {
    this.account = Account.generateNewAccount(NetworkType.TEST_NET)
  }

  async createTransaction() {
    const [
      epochAdjustment,
      networkType,
      networkGenerationHash,
    ] = await forkJoin([
      this.repo.getEpochAdjustment(),
      this.repo.getNetworkType(),
      this.repo.getGenerationHash(),
    ]).toPromise()

    const tx = TransferTransaction.create(
      Deadline.create(epochAdjustment),
      this.account.address,
      [],
      EmptyMessage,
      networkType,
    ).setMaxFee(500) as TransferTransaction

    this.signedTx = this.account.sign(tx, networkGenerationHash)
  }

  startToMonitorNewBlock() {
    this.newBlock$ = from(this.listener.open())
      .pipe(
        concatMap(() => this.listener.newBlock()),
      )
  }
}
