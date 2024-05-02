import { IInputReference } from '../../model/view.model';
import { IViewModel } from '../../model/viewModel/view-model';
import { BaseViewModelService } from './base-vm.service';
import { AutoPayWebComponent } from '../../index';
import { AutoPayService } from '../auto-pay.service';
import { Validation } from '../../utils/validation';
import { FormValidationService } from '../form-validation-service';
import {    JUMP_UPDATE_VIEW_MODEL, JUMP_ERROR_MESSAGE_LOADED
} from '../../constant/app.constant';
export class AutoPayViewModelService extends BaseViewModelService{
    public view:AutoPayWebComponent;
    public autoPayService:AutoPayService;     
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    // public iAutoPayModel:IAutoPay = Object.assign({});
    public formValidationService:FormValidationService;
    public autoPayFor:string;
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    constructor(view:AutoPayWebComponent,autoPayService:AutoPayService,formValidationService:FormValidationService, validationService:Validation){
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.view = view;
        this.autoPayFor = view?.autoPayFor;
        this.autoPayService = autoPayService;
        console.log('Auto Pay VM constructor');
    }

    handleComponentLoaded(){
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.setElementReference();
        this.checkToRunBindEvent();
    }
 
    handleErrMessageLoaded(pageType:string){
        if(pageType === ''){
            this.global.actionObserverService.fire(this,{detail:{action:JUMP_ERROR_MESSAGE_LOADED}});
        }
        this.executeBindEvent('handleErrMessageLoaded - auto-pay-vm-service.ts' + ' ' + pageType);
    }    
    handleReset(){
        this.reset();
    }
    bindEvents(){
        //this.bindTermOfCondition();
        this.inputReference.enrollInAutoPay = document.querySelector('#jump-cc-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        if(!this.inputReference.enrollInAutoPay) {
            this.inputReference.enrollInAutoPay = document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]') as HTMLInputElement;
        }
    }
  
    displayTermsAndCondition(isAutoPay:any,termsAndCondition:any) {
        if(isAutoPay.checked) {
            termsAndCondition?.classList.remove('d-none');
            termsAndCondition?.classList.add('show');
            isAutoPay = Object.assign({'checked':true});
            this.inputReference.termsAndCondition = Object.assign({'value':true});
        } else {
            termsAndCondition?.classList.add('d-none');
            termsAndCondition?.classList.remove('show');
            isAutoPay = Object.assign({'checked':false});
            this.inputReference.termsAndCondition = Object.assign({'value':false});
        }
    }
    
    errorMessageLoadHandler(): void{
        //
    } 
    reset() {  
        let termsAndCondition:any;
        let isAutoPay:any;
        termsAndCondition =  document.querySelectorAll('#jump-cc-web-component [name="jump-terms-of-conditions"]')[0];
        isAutoPay =  document.querySelector('#jump-cc-web-component [name="jump-auto-pay-checkbox"]');
        if(isAutoPay?.checked) {
            isAutoPay.checked = false;  
            this.resetAutopay(termsAndCondition,isAutoPay);   
        } 
        termsAndCondition =  document.querySelectorAll('#jump-ach-web-component [name="jump-terms-of-conditions"]')[0];                
        isAutoPay =  document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]');
        if(isAutoPay?.checked) {
            isAutoPay.checked = false;  
            this.resetAutopay(termsAndCondition,isAutoPay);   
        } 
    }
    resetAutopay(selectorTermsAndCondition:any,selectorAutopayCheckbox:any){                
        this.displayTermsAndCondition(selectorAutopayCheckbox,selectorTermsAndCondition);
    }
    submit(e:any){    
        const cardVm:IViewModel = Object.assign({});
        cardVm.isAutoPay = this.inputReference?.termsAndCondition?.value;
        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'auto-pay',data:cardVm }});     
    }
}
