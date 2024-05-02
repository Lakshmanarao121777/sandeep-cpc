import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { PaymentService } from '../payment.service';


@Component({
  selector: 'payment-detail-container',
  templateUrl: './payment-detail-container.component.html',
  styleUrls: ['./payment-detail-container.component.css']
})
export class PaymentDetailContainerComponent {
  constructor(private paymentService: PaymentService){

  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.paymentService.isEdit = true;
  }
}
