import { MinAchOnlyWebComponent } from '../../index';
import { Validation } from '../../utils/validation';
import { ErrorType, IInputReference, IKeyValuePair, LabelCase, PaymentType } from '../../model/view.model';
import { JUMP_UPDATE_VIEW_MODEL, MIN_ACH_COMPONENT } from '../../constant/app.constant';
import { FormValidationService } from '../form-validation-service';
import { BaseViewModelService } from './base-vm.service';
import { IViewModel } from '../../model/viewModel/view-model';
import { ACC_NUMB_POPUP_CONTENT, ACC_ROUT_POPUP_CONTENT } from '../../constant/modal.constant';
import { setPopupIcon } from '../../utils/card-type';
import { MinAchOnlyService } from '../min-ach-only.service';
/*
 * 1- All the service dependencies should be pass to the constructor of this service.
 * 2- Globals, utils, models, view modles, constants can be imported directly.
 * 3- All DOM manipulation should be done in CardOnlyViewModelService service.
 * 
 * FUNCTIONALITY THIS SERVICE PROVIDES:
 * 1-load the template
 * 2-bind all different type of events e.g.keyup, blur,paste etc.
 * 3-do the validation
 * 4-once validation is successful then dispatch and action along with valid data which would be listen by the AchOnlyService
 */

export class MinAchOnlyViewModelService extends BaseViewModelService{
    public view:MinAchOnlyWebComponent;
    public minAchOnlyService:MinAchOnlyService;
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    constructor(view:MinAchOnlyWebComponent,minAchOnlyService:MinAchOnlyService, formValidationService:FormValidationService, validationService:Validation){
        super(validationService,minAchOnlyService.config);
        this.formValidationService = new FormValidationService();
        this.formValidationService.paymentType =PaymentType.MinAchOnly;
        this.view = view;
        this.minAchOnlyService = minAchOnlyService;
        
    }
    handleComponentLoaded(){
        console.log('inside min-ach-only-vm');
        this.viewModel = this.minAchOnlyService.viewModel;
        this.viewModel.personalInfo = Object.assign({});
        this.viewModel.accountInfo = Object.assign({});
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.setElementReference();
        this.checkToRunBindEvent();
    }
    handleErrMessageLoaded(pageType:string){
        this.executeBindEvent('handleErrMessageLoaded - min-ach-only-vm-service.ts' + ' ' + pageType);
    }    
    handleReset(){
        console.log('jump-ach-component-reset');
        this.reset();
    }   
    setElementReference(){        
        const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputRefPair.push({key: 'accountNo', value:'[name="jump-account-no"]'});
        inputRefPair.push({key: 'routingNo', value:'[name="jump-routing-no"]'});
        inputRefPair.push({key: 'jumpModalTriggerAcc', value:'[name="jump-modal-trigger-acc"]'});
        inputRefPair.push({key: 'jumpModalTriggerRouting', value:'[name="jump-modal-trigger-routing"]'});
        inputRefPair.push({key: 'minAchTemplateContainer', value:'[name="jump-min-ach-only-template-container"]'});
        this.formValidationService.setElementReference(inputRefPair);
    }
    submit(e:any){  
        console.log('this.model.channel.channelData.selectedPaymentType ',this.minAchOnlyService.channel.channelData.selectedPaymentType) ;
        console.log('bind ach-only-vm');
        if(this.minAchOnlyService.channel.channelData.selectedPaymentType === 'minachonly'){
            const achVm:IViewModel = Object.assign({});
            achVm.accountInfo = Object.assign({});
            achVm.accountInfo.accountNo = this.inputReference?.accountNo?.value;
            achVm.accountInfo.routingNo = this.inputReference?.routingNo?.value; 
            achVm.personalInfo = Object.assign({});
            achVm.personalInfo = this.getPersonalInfo(e.detail.data.channelData.customerDetails);
            achVm.formSubmitChannelData = e.detail.data.channelData;
            if(this.validate()){
                this.global.updateVmMap.set(MIN_ACH_COMPONENT,false);
                this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'min-ach',data:achVm }});                
            }  
        }        
              
    }    
    edit(viewModel:IViewModel){
        if(viewModel){
            this.inputReference.firstName.value = viewModel.personalInfo.firstName;
            this.inputReference.lastName.value = viewModel.personalInfo.lastName;
            this.inputReference.accountNo.value = viewModel.accountInfo.accountNo;
            this.inputReference.routingNo.value = viewModel.accountInfo.routingNo;
        }
    }
    setViewModel(){        
        const viewModelPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        viewModelPair.push({key: 'accountNo', value: 'accountNo'});
        viewModelPair.push({key: 'routingNo', value: 'routingNo'});
        this.formValidationService.setViewModel(viewModelPair);
    }
    bindEvents(){    
        // const link = this.getElementRef('[name="jump-css-url"]');
        // this.appendCssUrl(config, link);

        this.setInputFieldErrMap();
        this.formValidationService.bindOnBlur();
        this.formValidationService.bindKeyup(['accountNo','routingNo']);
        this.formValidationService.bindPaste(['accountNo', 'routingNo']);
        
        this.setViewModel();
        this.changeLabel();
        this.launchModalPopup();      
        
        const accountNoIcon = this.getElementRef('[name="jump-account-no-min-card-icon"]');
        const routingNoIcon = this.getElementRef('[name="jump-routing-no-min-card-icon"]');
        setPopupIcon(accountNoIcon,'account-no-min-card');
        setPopupIcon(routingNoIcon,'routing-no-min-card');
    }
    launchModalPopup() {
        const modalPopupHeader = document.getElementById('jumpModalHeader');
        const modalPopupBody = document.getElementById('jumpModalBody');
        // const modalPopupBodyAcct = document.getElementById('jumpModalBody');
        const modalPopupFooter = document.getElementById('jumpModalFooter');

        this.inputReference.jumpModalTriggerAcc.addEventListener('click', () => {
            if(modalPopupHeader){
                modalPopupHeader.classList.add('jump-modal-header');
            }       
            if(modalPopupBody){                
                modalPopupBody.classList.add('jump-modal-body');
                modalPopupBody.innerHTML = ACC_NUMB_POPUP_CONTENT;
            }  
            if(modalPopupFooter){
                modalPopupFooter.remove();
            }    
        });
        this.inputReference.jumpModalTriggerRouting.addEventListener(
            'click',
            () => {
                if(modalPopupHeader){
                    modalPopupHeader.classList.add('jump-modal-header');
                }       
                if(modalPopupBody){                
                    modalPopupBody.classList.add('jump-modal-body');
                    modalPopupBody.innerHTML = ACC_ROUT_POPUP_CONTENT;
                }  
                if(modalPopupFooter){
                    modalPopupFooter.remove();
                }
            }
        );
    }
    
    changeLabel() {
        if (!this.minAchOnlyService.config.cpcPageLabelCase) return;
        switch (this.minAchOnlyService.config.cpcPageLabelCase.toString().toLowerCase()) {
        case LabelCase[LabelCase.CapOnlyFirst].toLowerCase():
            this.inputReference?.minAchTemplateContainer?.classList?.remove(
                'caps-all-first'
            );
            break;
        case LabelCase[LabelCase.CapAllFirst].toLowerCase():
            this.inputReference?.minAchTemplateContainer?.classList?.add(
                'caps-all-first'
            );
            break;
        default:
            break;
        }
    }    
    
    setInputFieldErrMap(){        
        const inputFieldErrPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputFieldErrPair.push({key:'accountNo', value:this.getErrorMessage(ErrorType.bank_account_number, ErrorType.invalid)});
        inputFieldErrPair.push({key:'routingNo', value:this.getErrorMessage(ErrorType.routing_number, ErrorType.invalid)});        
        this.formValidationService.initFormErrorMap(inputFieldErrPair);
    }
    removeAchErrorNodes(){
        this.removeErrorFeedback(this.inputReference['accountNo']);
        this.removeErrorFeedback(this.inputReference['routingNo']);
    }
    validate(): boolean {
        let flag = true;
        this.formFieldStatusMap.set('default', flag);
        this.removeAchErrorNodes();
        
        if (this.inputReference?.accountNo?.value) {
            const result = this.validationService.validateAccountNo(
                this.inputReference.accountNo.value
            );
            if (!result.isValid) {
                flag = false;
                this.inputReference.accountNo.classList.add('is-invalid');
                this.inputReference.accountNo?.parentElement.append(this.appendErrorFeedback(this.inputReference.accountNo, this.getErrorMessage(ErrorType.bank_account_number,ErrorType.invalid)));                
            } else {
                this.viewModel.accountInfo.accountNo = this.inputReference.accountNo.value;
                this.inputReference.accountNo.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.accountNo.classList.add('is-invalid');
            this.inputReference.accountNo.parentElement.append(this.appendErrorFeedback(this.inputReference.accountNo, this.getErrorMessage(ErrorType.bank_account_number,ErrorType.no_value)));
            console.log(this.getErrorMessage(ErrorType.bank_account_number,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('accountNo', flag);

        if (this.inputReference?.routingNo?.value) {
            const result = this.validationService.validateRoutingNo(
                this.inputReference.routingNo.value
            );
            if (!result.isValid) {
                flag = false;
                this.inputReference.routingNo.classList.add('is-invalid');
                this.inputReference.routingNo.parentElement.append(this.appendErrorFeedback(this.inputReference.routingNo, this.getErrorMessage(ErrorType.routing_number,ErrorType.invalid)));
            } else {
                this.viewModel.accountInfo.routingNo = this.inputReference.routingNo.value;
                this.inputReference.routingNo.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.routingNo.classList.add('is-invalid');
            this.inputReference.routingNo.parentElement.append(this.appendErrorFeedback(this.inputReference.routingNo, this.getErrorMessage(ErrorType.routing_number,ErrorType.no_value)));
            console.log(this.getErrorMessage(ErrorType.routing_number,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('routingNo', flag);
        flag = this.formValidationService.isFormValid(this.formFieldStatusMap); 
        if(flag === false) {
            const element:any = document.getElementsByClassName('invalid-feedback');
            element[0]?.parentElement.scrollIntoView();
        } 
        return flag;
    }
        
    // removeErrorNodes(arrInputRef:Array<string>){
    //     arrInputRef.forEach(item=>{
    //         this.removeErrorFeedback(this.inputReference[item as keyof IInputReference]);
    //     });     
    // }
    reset() {       
        this.viewModel.accountInfo.accountNo = this.inputReference.accountNo.value = '';
        this.inputReference.accountNo.classList.remove('is-invalid');
        this.removeErrorFeedback('accountNo');

        this.viewModel.accountInfo.routingNo = this.inputReference.routingNo.value = '';
        this.inputReference.routingNo.classList.remove('is-invalid');
        this.removeErrorFeedback('routingNo');
        const minAchOnly: any = document.getElementById(
            'jump-error-web-component-min-ach'
        );
        if(minAchOnly){
            minAchOnly.innerHTML ='';
        }        
    }
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.bank_account_number:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.bank_account_number,subKey);
            break;
        case ErrorType.routing_number:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.routing_number,subKey);
            break;
        case ErrorType.first_name:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.first_name,subKey);
            break;
        case ErrorType.last_name:            
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,ErrorType.last_name,subKey);
            break;
        case ErrorType.service:            
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        case ErrorType.system:            
            errorMessage = this.global.getErrorMessage(ErrorType.system, subKey);
            break;
        }
        return errorMessage;
    }
}