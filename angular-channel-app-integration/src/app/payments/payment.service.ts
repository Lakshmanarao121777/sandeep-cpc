import { EventEmitter, Injectable } from "@angular/core";
import { IPayment } from "./model";

@Injectable({
  providedIn: "root"
})

export class PaymentService {
  payment:IPayment = Object.assign({});
  customerInfo:any = Object.assign({});
  isEdit:boolean = false;
  formData: EventEmitter<any> = new EventEmitter<any>();
  isTypeChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
    console.log('payment service...');
  }

  setPaymentInfo(p: IPayment) {
    this.payment = p;
  }
  getPaymentInfo(): IPayment {
    return this.payment;
  }

  setCustomerDetail(customerDetail:any){
    this.customerInfo = customerDetail;
  }
  getCustomerDetail(){
    return this.customerInfo;
  }

}
