import { Component, OnInit } from '@angular/core';

import {
  Account, NetworkType, TransferTransaction, Deadline, EmptyMessage, SignedTransaction
} from 'symbol-sdk'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'my-app-with-nem';
  account: Account
  signedTx: SignedTransaction

  ngOnInit() {
    this.generateNewAccount()
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
}
