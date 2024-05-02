
import { Component, HostListener, OnDestroy } from '@angular/core';
import { environment } from './../../../environments/environment';
import {Router} from '@angular/router';
import { PaymentService } from '../payment.service';
import { IPayment } from '../model';
@Component({
  selector: 'payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnDestroy {
  hostAppUrl:string;
  cardTemplate:string;
  cpcPageType:string;
  iframeWidth:string;
  iframeHeight:string;
  iframeBorder: string;
  labelCase:string;
  paymentAmount:number;
  pageType:string;
  dataSubmitted = false;
  cssUrl: string;
  channelData = Object.assign({});
  customerInfo = Object.assign({});
  buttonDisplayText:string = 'Review Payment';
  isDisabled:boolean = false;
  isApiCallInProgress:boolean = false;
  isLoading:Boolean = false;

  constructor(private router:Router, private paymentService:PaymentService) {
    this.paymentService.formData.subscribe(data => {
      sessionStorage.setItem('pageType',data.pageType);
      sessionStorage.setItem('channelData',data.jsonData);
      sessionStorage.setItem('jsonSelect',data.jsonSelect);
      location.reload();
    }); 

    this.hostAppUrl = environment.hostedAppUrl;
    this.iframeHeight = environment.iframeHeight;
    this.iframeWidth = environment.iframeWidth;
    this.iframeBorder = environment.iframeBorder;
    this.cssUrl = environment.cssUrl;

    const pageType = sessionStorage.getItem('pageType');
    if(pageType) {
      this.cpcPageType = pageType;
      this.dataSubmitted = true;
    }
    
    if(this.cpcPageType === 'paymentTypeSelection') {
      this.pageType = 'paymentTypeSelection';
    }
   
    this.labelCase = environment.labelCase;

    this.channelData = Object.assign({});
    const jsonData = sessionStorage.getItem('channelData');
    if(jsonData) {
      const channelData = JSON.parse(jsonData);
      this.channelData = channelData[0];
      this.customerInfo = this.channelData.customerDetails;
      this.paymentService.setCustomerDetail(this.customerInfo);
    }
    let info:IPayment = Object.assign({});

    if(this.paymentService.isEdit) {
      this.channelData[0].editForm = Object.assign({});
      let paymentInfo = this.paymentService.getPaymentInfo();
      info.firstName = paymentInfo.firstName;
      info.lastName = paymentInfo.lastName;
      info.address = paymentInfo.address;
      info.addressLine2 = paymentInfo.addressLine2;
      info.city = paymentInfo.city;
      info.state = paymentInfo.state;
      info.zipCode = paymentInfo.zipCode;
      this.channelData.editForm = info;

      this.paymentService.isEdit = false;
    }
  }
  achOnly(){
    this.cpcPageType = 'AchOnly';
  }
  cardOnly(){
    this.cpcPageType = 'CardOnly';
  }

  ngOnDestroy() : void {
    this.handleRespose = function(): void { };
  }
  openTemplate(event:any){
    this.cpcPageType = event.target.value;
  }
  @HostListener('window:message', ['$event'])
  handleRespose(event:any) {
    // if(event && event.data && event.data.type === 'webpackOk' || (event.data.source && event.data.source.indexOf('react-devtools')>=0)) {
    //   return;
    // }
    if(event && event.data && typeof event.data==='string' && event.data.indexOf("\"action\":") >= 0){
      let messageData = JSON.parse(event.data);
      if(messageData && messageData.action) {
        switch(messageData.action) {
          case 'CPC_LOADING':
            this.isLoading = JSON.parse(messageData.isLoading);
            break;
          case 'JUMP-RESPONSE-RECEIVED':
            console.log('Data received from hosted app: ', messageData);
            let submissionDetails = messageData?.data?.cpcData?.submissionDetails;
            let paymentInfo:IPayment = Object.assign({});
            //addToWallet
            if(submissionDetails?.actionTaken === 'tokenize'){
              paymentInfo = this.addToWalletResponse(messageData);
            }
            //updateInstrument
            else if(submissionDetails?.actionTaken === 'update' || submissionDetails?.actionTaken === 'no_change'){
              paymentInfo = this.updateInstrumentResponse(messageData);
            }

            let apiStatus = submissionDetails?.cpcStatus;
            if(apiStatus.toLowerCase() === "success") {
                if(submissionDetails?.actionTaken === 'update' || submissionDetails?.actionTaken === 'no_change') {
                  console.log("paymentSubmissionMessage Success: ", submissionDetails?.cpcMessage);
                  this.router.navigate(['/payment-detail/update-payment-review']);
                } else {
                  console.log("paymentSubmissionMessage Success: ", submissionDetails?.cpcMessage);
                  this.router.navigate(['/payment-detail/payment-review']);
                }

            } else {
                console.log("paymentSubmissionMessage Error: ", submissionDetails?.cpcMessage);
            }
            break;
            case "CPC_MANAGE_PAYMENT_MODAL":
              console.log("CPC_MANAGE_PAYMENT_MODAL messageData: ", messageData);
            break;
            case 'CPC_FORM_SUBMIT_RESPONSE':
              console.log('step-p-4', messageData);
              let result = messageData.cpcData.submissionDetails;
              // document.getElementById('showMessage').innerHTML = result;
              if(result.actionTaken.toLowerCase() === 'delete') {
                document.location.reload();
              } 
              else if(result && (result.actionTaken.toLowerCase() === 'tokenize' || result.actionTaken.toLowerCase() === 'no_change' || result.actionTaken.toLowerCase() === 'update')) {
                messageData.gotoPaymentReview = true;
                let message:any = Object.assign({});

                message.action = 'JUMP-RESPONSE-RECEIVED';
                message.data = messageData;
                window.postMessage(JSON.stringify(message), "*");
              } else {
                this.buttonDisplayText = 'Review Payment';
                this.isDisabled = false;
                this.isApiCallInProgress = false;
              }
              break;
            case 'CPC_CONFIG_READY':
              console.log('channel app - CPC_READY', messageData);
              messageData.action = 'CPC_CONFIG_SUBMIT';
              messageData.channelData = this.channelData;
              document.querySelector("jump-web-component").shadowRoot.querySelector("iframe").contentWindow.postMessage(JSON.stringify(messageData), '*');
              break;
            case 'CPC_FORM_PROCESSING':
              console.log('channel app - CPC_FORM_PROCESSING', messageData);
              if(messageData && messageData.callInProgress){
                this.buttonDisplayText = 'Loading...';
                this.isDisabled = true;
                this.isApiCallInProgress = true;
              }
              break;
            case 'CPC_ERROR':
              console.log('channel app received! - CPC_ERROR', messageData);
              this.isApiCallInProgress = false;
              this.buttonDisplayText = 'Review Payment';
              this.isDisabled = false;
              break;
              case 'CPC_INFO_EVENT':
                console.log('CPC_INFO_EVENT...', messageData);
                document.dispatchEvent(new CustomEvent('c-tracking-log-page', {
                  detail: messageData.data,
                  bubbles: true
                }));
                break;
          default:
            break;
        }
      }
    }
  }
  addToWalletResponse(messageData:any): IPayment{
    let paymentInfo:IPayment = Object.assign({});
    let p = messageData.data.paymentInfo;
    if(!p){
      p = messageData.data.channelData.customerDetails;
    }
    paymentInfo.firstName = p.firstName;
    paymentInfo.lastName = p.lastName;
    paymentInfo.paymentAmount = messageData.data.channelData.paymentAmount;
    paymentInfo.paymentType = p.paymentType;
    paymentInfo.address = p.address;
    paymentInfo.addressLine2 = p.addressLine2;
    paymentInfo.city = p.city;
    paymentInfo.state = p.state;
    paymentInfo.zipCode = p.zipCode;
    paymentInfo.cpcData = messageData.data.cpcData;
    this.paymentService.setPaymentInfo(paymentInfo);
    return paymentInfo;
  }
  updateInstrumentResponse(messageData:any): IPayment{
    let paymentInfo:IPayment = Object.assign({});
    let customerDetail = messageData.data.channelData.customerDetails;
    paymentInfo.firstName = customerDetail.firstName;
    paymentInfo.lastName = customerDetail.lastName;
    paymentInfo.address = customerDetail.address;
    paymentInfo.addressLine2 = customerDetail.addressLine2;
    paymentInfo.city = customerDetail.city;
    paymentInfo.state = customerDetail.state;
    paymentInfo.zipCode = customerDetail.zipCode;
    paymentInfo.cpcData = messageData.data.cpcData;
    paymentInfo.paymentAmount = messageData.data.channelData.paymentAmount;
    paymentInfo.paymentType = messageData.data.channelData.paymentType;
    this.paymentService.setPaymentInfo(paymentInfo);
    return paymentInfo;
  }
  paymentClick(){
    console.log('step-p-1');
    const customerAddress = {
      address: '1701 JFK Blvd A',
      addressLine2: 'Studio C A',
      city: 'Philadelphia A',
      state: 'PA',
      zipCode: '19000',
    }
    this.channelData.customerDetails.walletId = 'cust559904'
                

    this.channelData.customerDetails.address = customerAddress.address;
    this.channelData.customerDetails.addressLine2 = customerAddress.addressLine2;
    this.channelData.customerDetails.city = customerAddress.city;
    this.channelData.customerDetails.state = customerAddress.state;
    this.channelData.customerDetails.zip = customerAddress.zipCode;

   // this.channelData[0].customerDetails.address = customerAddress.address;

    let message = {
    channel:'jump-iframe',
    action: 'CPC_FORM_SUBMIT',
    cpcPageType: this.cpcPageType,
    channelData: this.channelData
    }
    document.querySelector("jump-web-component").shadowRoot.querySelector("iframe").contentWindow.postMessage(JSON.stringify(message), '*');
  }
}
