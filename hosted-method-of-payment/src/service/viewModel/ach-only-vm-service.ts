import { AchOnlyWebComponent } from '../../index';
import { Validation } from '../../utils/validation';
import { ErrorType, IInputReference, IKeyValuePair, LabelCase, PaymentType } from '../../model/view.model';
import { ACH_COMPONENT, ADDRESS_COMPONENT, JUMP_UPDATE_VIEW_MODEL, CPC_WALLET_MGMT_NO_AUTOPAY_BANK_FORM_CANCELED, BANK, EVN_SAVE_PAYMENT_METHOD, CURRENT_CHANNEL_DOMAIN, ACH, CUSTOMER_CLASS_BUSINESS, ACH_ONLY_WITH_EDIT, USER_ROLE_ERROR_MAP, STORE_PAYMENT_ERROR_MAP} from '../../constant/app.constant';
import { FormValidationService } from '../form-validation-service';
import { BaseViewModelService } from './base-vm.service';
import { IViewModel } from '../../model/viewModel/view-model';
import { AchOnlyService } from '../ach-only.service';
import { ACC_NO_POPUP_CONTENT, ACC_NO_POPUP_TITLE } from '../../constant/modal.constant';
import { setPopupIcon } from '../../utils/card-type';
import { AchOnlyEditService } from '../ach-only-edit.service';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';
import { DataLayerService } from './../data-layer.service';
import { CareService } from '../care.service';
import { enableManualEntry } from './util/enable-manual-entry-util';
import { waitForElementToLoad } from '../../utils/elementLoader';
import { getUserRoleUtil } from './util/userrole-util';
import { ChannelService } from '../channel-service';
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

export class AchOnlyViewModelService extends BaseViewModelService{
    public achOnlyWebComponent:AchOnlyWebComponent;
    public achOnlyService:AchOnlyService;
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public achOnlyEditService:AchOnlyEditService = Object.assign({});
    public walletMgmtNoAutopayService:WalletMgmtNoAutopayService = Object.assign({});
    private currentPaymentType = '';
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    public isPaymentInstrumentCalled = false;
    private dataLayerService:DataLayerService = Object.assign({});
    public careServiceAch:CareService;
    constructor(achOnlyWebComponent:AchOnlyWebComponent,achOnlyService:AchOnlyService,achOnlyEditService:AchOnlyEditService, formValidationService:FormValidationService, validationService:Validation,walletMgmtNoAutopayService:WalletMgmtNoAutopayService, careServiceAch:CareService){
        super(validationService,achOnlyService.config);
        this.formValidationService = new FormValidationService();
        this.formValidationService.paymentType =PaymentType.AchOnly;
        this.achOnlyWebComponent = achOnlyWebComponent;
        this.achOnlyService = achOnlyService;
        this.achOnlyEditService = achOnlyEditService;
        this.careServiceAch = careServiceAch;
        this.walletMgmtNoAutopayService = walletMgmtNoAutopayService;
        this.dataLayerService = new DataLayerService();
    }
    handleComponentLoaded(){
        console.log('inside ach-only-vm');
        this.viewModel = this.achOnlyService.viewModel;
        this.viewModel.personalInfo = Object.assign({});
        this.viewModel.accountInfo = Object.assign({});
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.currentPaymentType = this.achOnlyService.config.cpcPageType.toString();

        if(this.achOnlyService.channel.channelData.config?.iguard?.enableIguardIntegration){
            this.careServiceAch.viewModel = this.achOnlyService.viewModel;
            this.careServiceAch.config = this.achOnlyService.config;
            this.careServiceAch.inputReference = this.inputReference;
            this.careServiceAch.formValidationService = this.formValidationService;
            this.careServiceAch.displayCareActions();
        }
        if(this.achOnlyService.channel.channelData.customerDetails.paymentToken && this.currentPaymentType === PaymentType[PaymentType.AchOnlyWithEdit].toLowerCase()) {
            //this.achOnlyEditService = new AchOnlyEditService();
            this.achOnlyEditService.viewModel = this.achOnlyService.viewModel;
            this.achOnlyEditService.config = this.achOnlyService.config;
            this.achOnlyEditService.inputReference = this.inputReference;
            this.achOnlyEditService.formValidationService = this.formValidationService;
            //this.achOnlyEditService.formValidationService.setContent();
            //this.achOnlyEditService.getExistingPaymentInstrument();
        }
        if(this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()){
            this.walletMgmtNoAutopayService.viewModel = this.achOnlyService.viewModel;
            this.walletMgmtNoAutopayService.config = this.achOnlyService.config;
            this.walletMgmtNoAutopayService.formValidationService = this.formValidationService;
            this.cardListSubmit();
        }
        this.setElementReference();
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        enableManualEntry(this.achOnlyEditService?.channel?.channelData?.config?.enableManualEntry, this.inputReference.accountNo, cpcPageType);
        this.checkToRunBindEvent();
    }
    handleErrMessageLoaded(pageType:string){
        this.executeBindEvent('handleErrMessageLoaded - ach-only-vm-service.ts' + ' ' + pageType);
    }    
    handleReset(){
        console.log('jump-ach-component-reset');
        this.reset();
    }   
    setElementReference(){
        console.log('setElementReference ach');
        const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputRefPair.push({key: 'firstName', value:'#jump-ach-only-container [name="jump-first-name"]'});
        inputRefPair.push({key: 'lastName', value:'#jump-ach-only-container [name="jump-last-name"]'});
        inputRefPair.push({key: 'accountNo', value:'#jump-ach-only-container [name="jump-account-no"]'});
        inputRefPair.push({key: 'routingNo', value:'#jump-ach-only-container [name="jump-routing-no"]'});
        inputRefPair.push({key: 'jumpModalTriggerAcc', value:'#jump-ach-only-container [name="jump-modal-trigger-acc"]'});
        inputRefPair.push({key: 'jumpModalTriggerRouting', value:'#jump-ach-only-container [name="jump-modal-trigger-routing"]'});
        inputRefPair.push({key: 'achTemplateContainer', value:'#jump-ach-only-container [name="jump-ach-template-container"]'});
        this.formValidationService.setElementReference(inputRefPair);
    }
    cardListSubmit():void {
        const saveButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-save-option-ach"]');
        saveButtonAch?.addEventListener('click', () => {
            this.submit('');
        });
        const cancelButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-cancel-option-ach"]');
        cancelButtonAch?.addEventListener('click', () => {
            const cardContainer = document.querySelector('#cardListPlaceholderBank [name="jump-bank-container"]');
            this.reset();
            cardContainer?.classList.remove('show');
            cardContainer?.classList.add('d-none');
            this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_BANK_FORM_CANCELED, true);
        });
    }
    submit(e:any){  
        console.log('this.model.channel.channelData.selectedPaymentType ',this.achOnlyService.channel.channelData.selectedPaymentType) ;
        console.log('bind ach-only-vm');
        const pageType:PaymentType = this.achOnlyService.config.cpcPageType;
        if(this.achOnlyService.channel.channelData.selectedPaymentType === 'achonly'){
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
            this.global.updateVmMap.set(ACH_COMPONENT,false);
            const achVm:IViewModel = Object.assign({});
            achVm.accountInfo = Object.assign({});
            achVm.accountInfo.accountNo = this.inputReference?.accountNo?.value;
            achVm.accountInfo.routingNo = this.inputReference?.routingNo?.value; 
            achVm.personalInfo = Object.assign({});
            achVm.personalInfo.firstName = this.inputReference?.firstName?.value;
            achVm.personalInfo.lastName = this.inputReference?.lastName?.value;
            if (e?.detail?.data?.channelData) {
                achVm.formSubmitChannelData = e.detail.data.channelData;
                achVm.walletId =  e?.detail?.data?.channelData?.customerDetails?.walletId;
            } else {
                achVm.formSubmitChannelData = this.achOnlyService?.channel?.channelData;
                achVm.walletId = this.achOnlyService.channel?.channelData?.customerDetails?.walletId;
            }
            if(this.careServiceAch.isIguardUtilized){
                if(this.careServiceAch.validate(false, ACH)){
                    this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'ach',data:achVm }});
                }
            }else{
                if(this.achOnlyService.channel.channelData.customerDetails.paymentToken && pageType.toString()===PaymentType[PaymentType.AchOnlyWithEdit].toString().toLowerCase()){
                    if(this.achOnlyEditService.validate()){
                        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'ach',data:achVm }});                
                    } 
                }else {
                    if(this.validate()){
                        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'ach',data:achVm }});                
                    }
                }              
            }
        }        
              
    }
    edit(viewModel:IViewModel){
        console.log('function call');
    }
    bindEvents(){
        //this.inputReference = this.formValidationService.inputReference;

        this.setInputFieldErrMap();
        this.formValidationService.bindOnBlur();
        this.formValidationService.bindKeyup(['firstName','lastName','accountNo','routingNo']);
        this.formValidationService.bindPaste(['accountNo', 'routingNo']);
        this.changeLabel();
        this.launchModalPopup();
        //this.setViewModel();     
        const accountNoIcon = this.getElementRef('[name="jump-account-no-icon"]');
        const routingNoIcon = this.getElementRef('[name="jump-routing-no-icon"]');
        setPopupIcon(accountNoIcon,'account-no');
        setPopupIcon(routingNoIcon,'routing-no');   
        if(!this.isPaymentInstrumentCalled && this.currentPaymentType.toLowerCase() === PaymentType[PaymentType.AchOnlyWithEdit].toLowerCase() && this.achOnlyEditService.channel.channelData?.customerDetails?.paymentToken) {
            this.achOnlyEditService.getExistingPaymentInstrument();
            this.isPaymentInstrumentCalled = true;
        }
        
        const defaultSelectedPaymentType = this.global.appState.get('channelData')?.config?.defaultSelectedPaymentType?.toLowerCase();
        const achOption =  document.querySelector('[id="jump-ach-type"]');
        if(defaultSelectedPaymentType === BANK) {
            achOption?.setAttribute('checked','true');
            achOption?.dispatchEvent(new Event('click'));
        }  
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();

        if(cpcPageType === ACH_ONLY_WITH_EDIT.toLowerCase()) {
            this.addressOnEdit();
        }      
    }
    addressOnEdit() {
        const addressOption = '#jump-ach-web-component [aria-describedby="newAddressOptionAch-jump-existing-address-info-label"]';  
        const addressOptionCheckbox = waitForElementToLoad(addressOption).then((addressOptionElement:any) => {
            addressOptionElement.addEventListener('click', ()=> {
                this.achOnlyEditService.getExistingPaymentInstrument(ACH);
            });
        });
    } 
    launchModalPopup() {
        const modalPopupTitle = document.getElementById('jumpModalTitle');
        const modalPopupBody = document.getElementById('jumpModalBody');
        this.inputReference.jumpModalTriggerAcc.addEventListener('click', () => {
            if (modalPopupTitle) {
                modalPopupTitle.innerHTML = ACC_NO_POPUP_TITLE;
            }
            if (modalPopupBody) {
                modalPopupBody.innerHTML = ACC_NO_POPUP_CONTENT;
            }
        });
        this.inputReference.jumpModalTriggerRouting.addEventListener(
            'click',
            () => {
                if (modalPopupTitle) {
                    modalPopupTitle.innerHTML = ACC_NO_POPUP_TITLE;
                }
                if (modalPopupBody) {
                    modalPopupBody.innerHTML = ACC_NO_POPUP_CONTENT;
                }
            }
        );
    }
    changeLabel() {
        if (!this.achOnlyService.config.cpcPageLabelCase) return;
        switch (this.achOnlyService.config.cpcPageLabelCase.toString().toLowerCase()) {
        case LabelCase[LabelCase.CapOnlyFirst].toLowerCase():
            this.inputReference.achTemplateContainer.classList.remove(
                'caps-all-first'
            );
            break;
        case LabelCase[LabelCase.CapAllFirst].toLowerCase():
            this.inputReference.achTemplateContainer.classList.add(
                'caps-all-first'
            );
            break;
        default:
            break;
        }
    }
    
    setInputFieldErrMap(){
        const inputFieldErrPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputFieldErrPair.push({key:'firstName', value:this.getErrorMessage(ErrorType.first_name, ErrorType.no_value)});
        inputFieldErrPair.push({key:'lastName', value:this.getErrorMessage(ErrorType.last_name, ErrorType.no_value)});
        inputFieldErrPair.push({key:'accountNo', value:this.getErrorMessage(ErrorType.bank_account_number, ErrorType.no_value)});
        inputFieldErrPair.push({key:'routingNo', value:this.getErrorMessage(ErrorType.routing_number, ErrorType.no_value)});        
        if(this.validationService.isSetStoredPayment()) {
            inputFieldErrPair.push({key:'storedPayment', value:this.getErrorMessage(ErrorType.stored_payment, ErrorType.invalid)});
            inputFieldErrPair.push({key:USER_ROLE_ERROR_MAP, value:this.getErrorMessage(ErrorType.userrole, ErrorType.no_value)});
            const autoPayCheckbox = this.inputReference.enrollInAutoPay;
            this.formValidationService?.autoPayChangeACH(autoPayCheckbox, this.inputReference?.storedPayment);
        }
        this.formValidationService.initFormErrorMap(inputFieldErrPair);
        if(this.achOnlyService.channel?.channelData?.editForm?.firstName){
            this.formValidationService.setErrorMap('firstName', true);
        }
        if(this.achOnlyService.channel?.channelData?.editForm?.lastName){
            this.formValidationService.setErrorMap('lastName', true);
        }
    }
    validate(): boolean {
        let flag = true;
        this.formFieldStatusMap.set('default', flag);
        if(this.validationService.isSetStoredPayment()) {
            this.removeErrorNodes(['firstName','lastName','accountNo','routingNo', 'storedPayment']);
        } else {
            this.removeErrorNodes(['firstName','lastName','accountNo','routingNo']);
        }
        
        if (this.inputReference?.firstName?.value) {
            const isValid = this.validationService.validateFirstName(
                this.inputReference.firstName.value,
                this.achOnlyService.channel?.channelData?.channelDetails?.customerClass
            ).isValid;
            if (!isValid) {
                flag = false;
                this.inputReference.firstName.classList.add('is-invalid');
                this.inputReference.firstName?.parentElement.append(
                    this.appendErrorFeedback(this.inputReference.firstName, this.getErrorMessage(ErrorType.first_name,ErrorType.invalid))
                );
            } else {
                //this.viewModel.personalInfo.firstName = this.inputReference.firstName.value;
                this.inputReference.firstName.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.firstName.classList.add('is-invalid');
            this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback(this.inputReference.firstName, this.getErrorMessage(ErrorType.first_name,ErrorType.no_value))
            );
            console.log(this.getErrorMessage(ErrorType.first_name,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('firstName', flag);

        if (this.inputReference?.lastName?.value) {
            const isValid = this.validationService.validateLastName(
                this.inputReference.lastName.value,
                this.achOnlyService.channel?.channelData?.channelDetails?.customerClass,PaymentType[PaymentType.AchOnly].toLowerCase()
            ).isValid;
            if (!isValid) {
                flag = false;
                this.inputReference.lastName.classList.add('is-invalid');
                this.inputReference.lastName?.parentElement.append(
                    this.appendErrorFeedback(this.inputReference.lastName, this.getErrorMessage(ErrorType.last_name,ErrorType.invalid))
                );
            } else {
                //this.viewModel.lastName = this.inputReference.lastName.value;
                this.inputReference.lastName.classList.remove('is-invalid');
            }

        } 
        // else if(this.achOnlyService.channel?.channelData?.channelDetails?.customerClass === CUSTOMER_CLASS_BUSINESS 
        // && !this.inputReference.lastName.value){
        //     flag = flag ? true : flag;
        // } 
        else {
            flag = false;
            this.inputReference.lastName.classList.add('is-invalid');
            this.inputReference.lastName?.parentElement.append(
                this.appendErrorFeedback(this.inputReference.lastName, this.getErrorMessage(ErrorType.last_name,ErrorType.no_value))
            );
            console.log(this.getErrorMessage(ErrorType.last_name,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('lastName', flag);

        if (this.inputReference?.accountNo?.value) {
            const result = this.validationService.validateAccountNo(
                this.inputReference.accountNo.value
            );
            if (!result.isValid) {
                flag = false;
                this.inputReference.accountNo.classList.add('is-invalid');
                this.inputReference.accountNo.parentElement.append(
                    this.appendErrorFeedback(this.inputReference.accountNo, this.getErrorMessage(ErrorType.bank_account_number,result.errorType))
                );
            } else {
                //this.viewModel.accountNo = this.inputReference.accountNo.value;
                this.inputReference.accountNo.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.accountNo.classList.add('is-invalid');
            this.inputReference.accountNo.parentElement.append(
                this.appendErrorFeedback(this.inputReference.accountNo, this.getErrorMessage(ErrorType.bank_account_number,ErrorType.no_value))
            );
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
                this.inputReference.routingNo.parentElement.append(
                    this.appendErrorFeedback(this.inputReference.routingNo, this.getErrorMessage(ErrorType.routing_number,result.errorType))
                );
            } else {
                //this.viewModel.routingNo = this.inputReference.routingNo.value;
                this.inputReference.routingNo.classList.remove('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.routingNo.classList.add('is-invalid');
            this.inputReference.routingNo.parentElement.append(
                this.appendErrorFeedback(this.inputReference.routingNo, this.getErrorMessage(ErrorType.routing_number,ErrorType.no_value))
            );
            console.log(this.getErrorMessage(ErrorType.routing_number,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('routingNo', flag);
        if(this.validationService.isSetStoredPayment()) {
            // if(!this.inputReference?.storedPayment) {
            const storedPaymentAchElement = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
            this.inputReference.storedPayment = storedPaymentAchElement;

            if(this.inputReference?.storedPayment.checked){
                const userrole = getUserRoleUtil(new ChannelService(this.achOnlyService.channel.channelData), 'ach', this.achOnlyService.channel.channelData.customerDetails.walletId);
                const componnetId = '#jump-ach-web-component [id="jump-userrole-list"]';
                const element = document.querySelector(componnetId);
                this.removeErrorUserroleFeedback(element, 'jump-userrole-list-ach');
                if(this.validationService.isUserRoleValid(userrole, ACH)){
                    flag = true;
                    element?.parentElement?.classList.remove('jump-userrole-invalid-feedback');
                    this.formValidationService.setErrorMap(USER_ROLE_ERROR_MAP, true);
                }else{
                    flag =false;
                    this.formValidationService.setErrorMap(USER_ROLE_ERROR_MAP, false);
                    element?.parentElement?.classList.add('jump-userrole-invalid-feedback');
                    element?.parentElement?.append(this.appendErrorUserroleFeedback('jump-userrole-list-ach', this.getErrorMessage(ErrorType.userrole,ErrorType.no_value)));
                }
            }
            // }
            this.formFieldStatusMap.set('userrole', flag);
        }
        
        if(this.validationService.isSetStoredPayment()) {
            if (this.inputReference?.storedPayment) {
                const result = this.validationService?.validateAutoPayAndStoredPaymentACH();
                if (!result) {
                    flag = false;
                    this.formValidationService.setErrorMap(STORE_PAYMENT_ERROR_MAP, false);
                    this.inputReference?.storedPayment?.classList.add('is-invalid');
                    this.inputReference?.storedPayment?.parentElement.append(this.appendErrorFeedback(this.inputReference?.storedPayment, this.getErrorMessage(ErrorType.stored_payment,ErrorType.invalid)));                
                } else {
                    this.formValidationService.setErrorMap(STORE_PAYMENT_ERROR_MAP, true);
                    this.inputReference?.storedPayment?.classList.remove('is-invalid');
                }
            } else {
                flag = false;
                this.inputReference?.storedPayment?.classList.add('is-invalid');
                this.inputReference?.storedPayment?.parentElement.append(this.appendErrorFeedback(this.inputReference?.storedPayment, this.getErrorMessage(ErrorType.stored_payment,ErrorType.invalid)));
                console.log(this.getErrorMessage(ErrorType.form, ErrorType.stored_payment));
            }
            this.formFieldStatusMap.set('storedPayment', flag);
        }
        flag = this.formValidationService.isFormValid(this.formFieldStatusMap); 
        if(flag === false) {
            const element:any = document.getElementsByClassName('invalid-feedback');
            element[0]?.parentElement?.scrollIntoView();
        } 
        return flag;
    }    
    removeErrorNodes(arrInputRef:Array<string>){
        arrInputRef.forEach(item=>{
            this.removeErrorFeedback(this.inputReference[item as keyof IInputReference]);
        });     
    }
    reset() {
        if(!this.achOnlyService.channel?.channelData?.editForm) {
            this.viewModel.personalInfo.firstName = this.inputReference.firstName.value = '';            
            this.viewModel.personalInfo.lastName = this.inputReference.lastName.value = '';            
        }
        // if(this.viewModel?.channelData?.editForm?.firstName){
        //     this.viewModel.channelData.editForm.firstName = '';
        //     this.formValidationService.setErrorMap('firstName', false);

        // } else {
        //     this.viewModel.firstName = this.inputReference.firstName.value = '';            
        // }
        // if(this.viewModel?.channelData?.editForm?.lastName){
        //     this.viewModel.channelData.editForm.lastName = '';
        //     this.formValidationService.setErrorMap('lastName', false);

        // } else {
        //     this.viewModel.lastName = this.inputReference.lastName.value = '';            
        // }
        
        this.inputReference.firstName.classList.remove('is-invalid');
        this.removeErrorFeedback('firstName');

        this.inputReference.lastName.classList.remove('is-invalid');
        this.removeErrorFeedback('lastName');

        this.viewModel.accountInfo.accountNo = this.inputReference.accountNo.value = '';
        this.inputReference.accountNo.classList.remove('is-invalid');
        this.removeErrorFeedback('accountNo');

        this.viewModel.accountInfo.routingNo = this.inputReference.routingNo.value = '';
        this.inputReference.routingNo.classList.remove('is-invalid');
        this.removeErrorFeedback('routingNo');
        if(!this.inputReference?.storedPayment) {
            const storedPaymentAchElement = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
            this.inputReference.storedPayment = storedPaymentAchElement;
            this.inputReference?.storedPayment?.classList?.remove('is-invalid');
        } else {
            this.inputReference?.storedPayment?.classList?.remove('is-invalid');
        }
        const achOnly: any = document.getElementById(
            'jump-error-web-component-ach'
        );
        if(achOnly){
            achOnly.innerHTML ='';
        }
        this.formValidationService.setErrorMap(USER_ROLE_ERROR_MAP, true);
        this.formValidationService.setErrorMap(STORE_PAYMENT_ERROR_MAP, true);       
    }
    getErrorMessage(key:string, subKey?:string): string {        
        let errorMessage = '';
        switch(key){
        case ErrorType.service:            
            errorMessage = this.global.getErrorMessage(ErrorType.service, subKey);
            break;
        case ErrorType.stored_payment:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.stored_payment,ErrorType.invalid);
            break;  
        case ErrorType.userrole:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.userrole,ErrorType.no_value);
            break; 
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.bank,key,subKey);
            break;
        }
        return errorMessage;
    }
}
