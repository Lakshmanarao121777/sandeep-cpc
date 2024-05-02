import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'card-or-bank',
  templateUrl: './card-or-bank.html',
  styleUrls: ['./card-or-bank.css']
})
export class CardOrBankComponent {
  title = 'angular-channel-app-integration';
  @Output() cpcPageTypeChange:EventEmitter<string> =  new EventEmitter<string>();

  openTemplate(event:any){
    this.cpcPageTypeChange.emit(event);
  }
}
