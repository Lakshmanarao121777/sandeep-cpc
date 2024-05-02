import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPayment } from '../model';
import { PaymentService } from '../payment.service';


@Component({
  selector: 'payment-review',
  templateUrl: './payment-review.component.html',
  styleUrls: ['./payment-review.component.css']
})
export class PaymentReviewComponent implements OnInit {
  title = 'payment review component';
  aDate:Date = new Date();
  paymentInfo:IPayment = Object.assign({});
  bankAccountLast4Digits;
  bankAccountType;
  cardLast4Digits;
  cardType;
  constructor(private router:Router, private paymentService:PaymentService) {
  }
  ngOnInit(){
    this.paymentInfo = this.paymentService.getPaymentInfo();
    this.cardLast4Digits = this.paymentInfo.cpcData?.cardDetails?.cardLast4Digits;
    this.bankAccountType = this.paymentInfo.cpcData?.bankDetails?.bankAccountType;
    this.bankAccountLast4Digits = this.paymentInfo.cpcData?.bankDetails?.bankAccountLast4Digits;
    this.cardType = this.paymentInfo.cpcData?.cardDetails?.cardType;
  }

  paymentClick(){
    console.log('container component!');
  }
  onEdit(){
    this.paymentService.isEdit = true;
    this.router.navigate(['/payment-detail']);
  }
}
