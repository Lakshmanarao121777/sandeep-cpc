import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'continue-payment-button',
  templateUrl: './continue-payment-button.html',
  styleUrls: ['./continue-payment-button.css']
})
export class ContinuePaymentButtonComponent {
  title = 'angular-channel-app-integration';
  @Input() buttonText: string;
  @Input() isApiCallInProgress:boolean;
  @Input() isDisabled:boolean;
  @Output() onContinuePayment:EventEmitter<boolean> =  new EventEmitter<boolean>();

  onPaymentClick(){
    console.log('button component!');
    this.onContinuePayment.emit(true);
  }
}
