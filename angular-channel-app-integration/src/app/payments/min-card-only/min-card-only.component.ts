import { Component, OnInit  } from '@angular/core';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'min-card-only',
  templateUrl: './min-card-only.component.html',
  styleUrls: ['./min-card-only.component.css']
})
export class MinCardOnlyComponent implements OnInit {
  title = 'minimum card only component';
  customerInfo:any = Object.assign({});
  
  constructor(private paymentService:PaymentService) {
  }
  ngOnInit(){
    this.customerInfo = this.paymentService.getCustomerDetail();
  }
}
