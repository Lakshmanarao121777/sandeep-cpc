import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPayment } from '../model';
import { PaymentService } from '../payment.service';


@Component({
  selector: 'update-payment-review',
  templateUrl: './update-payment-review.component.html',
  styleUrls: ['./update-payment-review.component.css']
})
export class UpdatePaymentReviewComponent implements OnInit {
  title = 'update payment review component';
  constructor(private router:Router, private paymentService:PaymentService) {
  }
  ngOnInit(){
  }

  paymentClick(){
    console.log('container component!');
  }
  onEdit(){
    this.paymentService.isEdit = true;
    this.router.navigate(['/payment-detail']);
  }
}
