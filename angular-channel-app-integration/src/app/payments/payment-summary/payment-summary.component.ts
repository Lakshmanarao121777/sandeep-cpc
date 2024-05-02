
import { Component, OnInit } from '@angular/core';
import {FormGroup,Validators, FormBuilder} from '@angular/forms';
import { PaymentService } from '../payment.service';
import *  as channelData from '../channelData.json';

@Component({
  selector: 'payment-summary',
  templateUrl: './payment-summary.component.html',
  styleUrls: ['./payment-summary.component.css']
})
export class PaymentSummaryComponent implements OnInit {
  title = 'payment summary component';
  dataForm:FormGroup;
  defualtJsonData = channelData;
  constructor(private fb: FormBuilder , private paymentService:PaymentService) {
  }
  ngOnInit(): void {
    this.dataForm = this.fb.group({
      pageType: ['', Validators.required],
      jsonSelect: ['' , Validators.required],
      jsonData: ['', Validators.required],
    });
    const pageType = sessionStorage.getItem('pageType');
    const jsonData = sessionStorage.getItem('channelData');
    const jsonSelect = sessionStorage.getItem('jsonSelect');
    if(pageType) {
      this.dataForm.controls.pageType.setValue(pageType);
    }
    if(jsonData) {
      this.dataForm.controls.jsonData.setValue(jsonData);
    }
    if(jsonSelect) {
      this.dataForm.controls.jsonSelect.setValue(jsonSelect);
    }
  }

  appendJsonData(): void {
    let jsonData = this.defualtJsonData.channelData.filter(i => i.key === this.dataForm.controls.jsonSelect.value)
    if(jsonData) {
      let channelData = JSON.stringify(jsonData,null, "\t");
     // channelData = channelData.replace('[','');
      //channelData = channelData.replace(']','');
      this.dataForm.controls.jsonData.setValue(channelData);
    } else {
      alert("No Data Found for selected channel , please select another channel");
    }
  }
 
  onSubmit(): void {
    console.log(this.dataForm.valid);
    const isJsonCorrect = this.isJsonString(this.dataForm.value.jsonData);
    if(!isJsonCorrect) {
      alert("Please Verify JSON Data");
    } else {
      this.paymentService.formData.emit(this.dataForm.value);
    }
  }
 isJsonString(str: string): boolean {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
}
