import { Component, OnInit  } from '@angular/core';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'min-ach-only',
  templateUrl: './min-ach-only.component.html',
  styleUrls: ['./min-ach-only.component.css']
})
export class MinAchOnlyComponent implements OnInit {
  title = 'minimum ach only component';
  customerInfo:any = Object.assign({});
  constructor(private paymentService:PaymentService) {
  }
  ngOnInit(){
    this.customerInfo = this.paymentService.getCustomerDetail();
  }
}
