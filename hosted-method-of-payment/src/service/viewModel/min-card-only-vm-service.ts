import { MinCardOnlyWebComponent } from '../../index';
import { Validation } from '../../utils/validation';
import { ErrorType, IInputReference, IKeyValuePair, LabelCase, MessageType, PaymentType } from '../../model/view.model';
import { EVN_CPC_ERROR, JUMP_UPDATE_VIEW_MODEL, CURRENT_CHANNEL_DOMAIN } from '../../constant/app.constant';
import { FormValidationService } from '../form-validation-service';
import { getCardType, setCCImage, setPopupIcon } from '../../utils/card-type';
import { BaseViewModelService } from './base-vm.service';
import { IViewModel } from '../../model/viewModel/view-model';
import { MIN_CARD_CVV_POPUP_CONTENT } from '../../constant/modal.constant';
import { MinCardOnlyService } from '../min-card-only.service';
import { MinCardEditService } from '../min-card-edit.service';
import { ErrorHandling } from '../../utils/error-handling';
/*
 * 1- All the service dependencies should be pass to the constructor of this service.
 * 2- Globals, utils, models, view modles, constants can be imported directly.
 * 3- All DOM manipulation should be done in CardOnlyViewModelService service.
 * 
 * FUNCTIONALITY THIS SERVICE PROVIDES:
 * 1-load the template
 * 2-bind all different type of events e.g.keyup, blur,paste etc.
 * 3-do the validation
 * 4-once validation is successful then dispatch and action along with valid data which would be listen by the CardOnlyService
 */
export class MinCardOnlyViewModelService extends BaseViewModelService{
    public minCardOnlyWebComponent:MinCardOnlyWebComponent;
    public minCardOnlyService:MinCardOnlyService;            
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public minCardEditService:MinCardEditService = Object.assign({});
    private currentPaymentType = '';
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    private errorHandling:ErrorHandling = new ErrorHandling();
    constructor(minCardOnlyWebComponent:MinCardOnlyWebComponent,minCardOnlyService:MinCardOnlyService,minCardEditService:MinCardEditService, formValidationService:FormValidationService, validationService:Validation){
        super(validationService,minCardOnlyService.config);
        this.formValidationService = new FormValidationService();
        this.formValidationService.paymentType = PaymentType.MinCardOnly;
        this.minCardOnlyWebComponent = minCardOnlyWebComponent;
        this.minCardOnlyService = minCardOnlyService;  
        this.minCardEditService = minCardEditService;      
    }
    handleComponentLoaded(){
        console.log('inside min-card-only-vm');
        //this.cardOnlyService.viewModel.templateContent = this.cardOnlyWebComponent.templateContent;
        this.viewModel = this.minCardOnlyService.viewModel;
        this.viewModel.personalInfo = Object.assign({});
        this.viewModel.cardInfo = Object.assign({});
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        
        if(this.minCardOnlyService.config.cpcPageType.toString().toLowerCase() === PaymentType[PaymentType.MinCardOnlyWithEdit].toLowerCase()){
            //this.minCardEditService = new MinCardEditService();
            //this.minCardEditService.viewModel = this.viewModel;
            this.minCardEditService.config = this.minCardOnlyService.config;            
            this.minCardEditService.viewModel = this.minCardOnlyService.viewModel;
            this.minCardEditService.inputReference = this.inputReference;
            this.minCardEditService.formValidationService = this.formValidationService;
        }        
        this.currentPaymentType = this.minCardOnlyService.config.cpcPageType.toString();
        //const link = this.getElementRef('[name="jump-css-url"]'); 	
        //this.appendCssUrl(config,link);

        const cvvIcon = this.getElementRef('[name="jump-cvv-min-card-icon"]');
        setPopupIcon(cvvIcon,'cvv-min-card');
        
        //this.errorMessageLoadHandler();

        this.setElementReference();    
        this.inputReference.cvv.disabled = true;
        this.checkToRunBindEvent();
    }
    //TODO:not being called, before subscription error.json filed loaded, so calling it handleComponentLoaded
    handleErrMessageLoaded(pageType:string){
        this.executeBindEvent('handleErrMessageLoaded - min-card-only-vm-service.ts' + ' ' + pageType);
    }    
    handleReset(){
        console.log('jump-cc-component-reset');
        this.reset();
    }

    setElementReference(){
        const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputRefPair.push({key: 'cc', value:'[name="jump-credit-card"]'});
        inputRefPair.push({key: 'ccImg', value:'[name="jump-credit-card-img"]'});
        inputRefPair.push({key: 'cvv', value:'[name="jump-cvv"]'});
        inputRefPair.push({key: 'expiration', value:'[name="jump-expiration"]'});
        inputRefPair.push({key: 'jumpModalTrigger', value:'[name="jump-modal-trigger"]'});
        inputRefPair.push({key: 'ccTemplateContainer', value:'[name="jump-min-cc-template-container"]'});
        this.formValidationService.setElementReference(inputRefPair);
    }
    submit(e:any){    
        console.log('bind min-card-only-vm submit', JSON.stringify(e.detail.data));
        console.log('this.model.channel.channelData.selectedPaymentType ',this.minCardOnlyService.channel.channelData.selectedPaymentType) ;
        const pageType:PaymentType = this.minCardOnlyService.config.cpcPageType;
        if(pageType.toString()===PaymentType[PaymentType.MinCardOnlyWithEdit].toString().toLowerCase()){
            this.submitEdit(e);
        } else{
            //if(this.minCardOnlyService.channel.channelData.selectedPaymentType === 'cardonly'){
            const cardVm:IViewModel = Object.assign({});
            cardVm.cardInfo = Object.assign({});
            cardVm.cardInfo.ccNo = this.inputReference?.cc?.value;
            const expirationArr = this.inputReference.expiration.value.split('/');                
            cardVm.cardInfo.expMonth = expirationArr[0]; 
            cardVm.cardInfo.expYear = expirationArr[1];
            cardVm.cardInfo.cvv = this.inputReference?.cvv?.value;
            cardVm.cardInfo.cardType = getCardType(this.inputReference.cc.value);
            cardVm.personalInfo = Object.assign({});
            cardVm.personalInfo = this.getPersonalInfo(e.detail.data.channelData.customerDetails);
            cardVm.formSubmitChannelData = e.detail.data.channelData;

            // console.log('updated cardvm submit', JSON.stringify(cardVm))
            if(this.validate()){                
                this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'min-cc',data:cardVm }});
            }        
            //}
        }       
                
    }
    submitEdit(e:any){    
        console.log('bind card-only-vm edit');
                
        const cardVm:IViewModel = Object.assign({});
        cardVm.cardInfo = Object.assign({});
        cardVm.cardInfo.ccNo = this.inputReference?.cc?.value;
        const expirationArr = this.inputReference.expiration.value.split('/');                
        cardVm.cardInfo.expMonth = expirationArr[0]; 
        cardVm.cardInfo.expYear = expirationArr[1];
        cardVm.cardInfo.cvv = this.inputReference?.cvv?.value;
        cardVm.cardInfo.cardType = getCardType(this.inputReference.cc.value);
        cardVm.personalInfo = Object.assign({});
        cardVm.personalInfo = this.getPersonalInfo(e.detail.data.channelData.customerDetails);
        cardVm.formSubmitChannelData = e.detail.data.channelData;
        if(this.minCardEditService.validate()){                
            this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'min-edit-cc',data:cardVm }});
        } else {
            const cpcFormError = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error,this.getErrorMessage(ErrorType.form,ErrorType.default));
            parent.postMessage(JSON.stringify(cpcFormError), CURRENT_CHANNEL_DOMAIN.URI);
        }               
    }
    bindEvents(){
        this.setInputFieldErrMap();
        this.formValidationService.bindOnBlur();
        this.formValidationService.bindKeyup(['cc','cvv' ,'expiration']);
        this.formValidationService.bindPaste(['cc', 'cvv','expiration']);
        
        this.setViewModel();
        this.changeLabel();
        this.launchModalPopup();
        //console.log('view model...mincardonly ',this.minCardOnlyService.viewModel);
        if(this.currentPaymentType.toLowerCase() === PaymentType[PaymentType.MinCardOnlyWithEdit].toLowerCase() && this.minCardEditService.channel.channelData?.customerDetails?.paymentToken) {
            this.minCardEditService.getExistingPaymentInstrument();
            this.formValidationService.handleKeyDownEvent('cc');
        }else{
            setCCImage(this.inputReference.ccImg);
        }
    }
  
    setInputFieldErrMap(){        
        const inputFieldErrPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        //inputFieldErrPair.push({key:'cc', value:ERR_CC_INVALID}); 
        inputFieldErrPair.push({key:'cc', value:this.getErrorMessage(ErrorType.form,ErrorType.default)});
        // inputFieldErrPair.push({key:'cvv', value:ERR_CVV_INVALID}); 
        inputFieldErrPair.push({key:'cvv', value:this.getErrorMessage(ErrorType.form,ErrorType.default)}); 
        //inputFieldErrPair.push({key:'expiration', value:ERR_MM_EMPTY});
        inputFieldErrPair.push({key:'expiration', value:this.getErrorMessage(ErrorType.form,ErrorType.default)});
        this.formValidationService.initFormErrorMap(inputFieldErrPair);        
    }
    setViewModel(){
        const viewModelPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        viewModelPair.push({key: 'firstName', value: 'firstName'});
        viewModelPair.push({key: 'lastName', value: 'lastName'});
        viewModelPair.push({key: 'ccNo', value: 'cc'});
        viewModelPair.push({key: 'expMonth', value: 'expMM'});
        viewModelPair.push({key: 'expYear', value: 'expYY'});
        viewModelPair.push({key: 'cvv', value: 'cvv'});        
        this.formValidationService.setViewModel(viewModelPair);
    }
    launchModalPopup(){
        const modalPopupHeader = document.getElementById('jumpModalHeader');
        const modalPopupBody = document.getElementById('jumpModalBody');
        const modalPopupFooter = document.getElementById('jumpModalFooter');
      
        this.inputReference.jumpModalTrigger.addEventListener('click', () => {
            console.log('modal clicked!');   
            if(modalPopupHeader){
                modalPopupHeader.classList.add('jump-modal-header');
            }         
            if(modalPopupBody){                
                modalPopupBody.classList.add('jump-modal-body');
                modalPopupBody.innerHTML = MIN_CARD_CVV_POPUP_CONTENT;
            }        
            if(modalPopupFooter){
                modalPopupFooter.remove();
            }
        });
    }
    changeLabel(){
        if(!this.minCardOnlyService.config.cpcPageLabelCase) return;
        switch (this.minCardOnlyService.config.cpcPageLabelCase.toString().toLowerCase()){
        case LabelCase[LabelCase.CapOnlyFirst].toLowerCase():
            this.inputReference.ccTemplateContainer.classList.remove('caps-all-first');
            break;          
        case LabelCase[LabelCase.CapAllFirst].toLowerCase():
            this.inputReference.ccTemplateContainer.classList.add('caps-all-first');
            break;
        default:
            break;
        }      
    }  
    applyValidation(): boolean {
        let flag = true;
        if(this.currentPaymentType === PaymentType[PaymentType.MinCardOnlyWithEdit].toLowerCase()){
            flag = this.minCardEditService.validate();
        } else {
            flag = this.validate();
        }
        return flag;
    }
    validate(): boolean {
        let flag =true;
        this.formFieldStatusMap.set('default', flag);  
        const errorHandling:ErrorHandling = new ErrorHandling(this.minCardOnlyService.channel);
        if(this.inputReference?.cc?.value) {
            const result = this.validationService.validateCC(this.inputReference.cc.value);
            if(!result.isValid){
                flag = false;
                this.inputReference.cc.classList.add('is-invalid');
            }else{
                //this.viewModel.ccNo = this.inputReference.cc.value;
                this.inputReference.cc.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.cc.classList.add('is-invalid');
        }
        this.formFieldStatusMap.set('cc', flag);        
       
        if(this.inputReference?.cvv?.value) {
            const result = this.validationService.validateExpCvv(this.inputReference.cvv.value, this.inputReference.cc.value);
            if(!result.isValid){
                flag = false;
                this.inputReference.cvv.classList.add('is-invalid');
            }else{
                //this.viewModel.cvv = this.inputReference.cvv.value;
                this.inputReference.cvv.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.cvv.classList.add('is-invalid');
        }
        this.formFieldStatusMap.set('cvv', flag);

        if(this.inputReference?.expiration?.value && this.inputReference?.expiration.value.length >= 5) {
            const isValid = this.validationService.validExpirationCheck(this.inputReference.expiration.value);
            if(!isValid){
                flag = false;
                this.inputReference.expiration.classList.add('is-invalid');
            }else{
                this.inputReference.expiration.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.expiration.classList.add('is-invalid');
        }
        this.formFieldStatusMap.set('expiration', flag);

        
        flag = this.formValidationService.isFormValid(this.formFieldStatusMap);
        if(flag === false) {
            const cpcMessage = errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.form, MessageType.error, this.getErrorMessage(ErrorType.form, ErrorType.default));
            errorHandling.showError(cpcMessage, '');
            const element:any = document.getElementsByClassName('invalid-feedback');
            element[0]?.parentElement.scrollIntoView();
        } 
        return flag;
    }
    reset(){     
        this.viewModel.cardInfo.ccNo = this.inputReference.cc.value = '';
        this.inputReference.cc.classList.remove('is-invalid');

        //this.viewModel.expMonth = '';
        this.inputReference.expiration.value = '';
        this.inputReference.expiration.classList.remove('is-invalid');

        this.viewModel.cardInfo.cvv = this.inputReference.cvv.value = '';
        this.inputReference.cvv.classList.remove('is-invalid');
        const errorWebComp = document.getElementById('jump-error-web-component-min-card');
        if(errorWebComp) {
            errorWebComp.setAttribute('display', 'none');
        } 
    }
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.form:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,subKey);
            break;
        case ErrorType.service:            
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,key,subKey);
            break;
        }
        return errorMessage;
    }   
}