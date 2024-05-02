import { CareWebComponent } from '../../index';
import { CardOnlyWebComponent } from '../../index';
import { CardOnlyService } from '../card-only.service';
import { Validation } from '../../utils/validation';
import { CPCContentType, ErrorType, IInputReference, IKeyValuePair, LabelCase, PaymentType } from '../../model/view.model';
import { ADDRESS_COMPONENT, CARD_COMPONENT, CUSTOMER_CLASS_BUSINESS, JUMP_UPDATE_VIEW_MODEL, LABEL_FIRST_NAME, LABEL_LAST_NAME, CPC_WALLET_MGMT_NO_AUTOPAY_CARD_FORM_CANCELED, CARD,CARD_ONLY_WITH_EDIT, CC, USER_ROLE_ERROR_MAP, STORE_PAYMENT_ERROR_MAP } from '../../constant/app.constant';
import { FormValidationService } from '../form-validation-service';
import { getCardType, setPopupIcon } from '../../utils/card-type';
import { BaseViewModelService } from './base-vm.service';
import { IViewModel } from '../../model/viewModel/view-model';
import { CVV_POPUP_CONTENT, CVV_POPUP_TITLE } from '../../constant/modal.constant';
import { LabelService } from '../label.service';
import { CardOnlyEditService } from '../card-only-edit.service';
import { CareService } from '../care.service';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';
import { DataLayerService } from './../data-layer.service';
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
 * 4-once validation is successful then dispatch and action along with valid data which would be listen by the CardOnlyService
 */
export class CardOnlyViewModelService extends BaseViewModelService {
    public cardOnlyWebComponent:CardOnlyWebComponent;
    public cardOnlyService:CardOnlyService;        
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    private labelText:Map<string, string>;
    public labelService:LabelService;
    public cardOnlyEditService:CardOnlyEditService = Object.assign({});
    public careServiceCC:CareService = Object.assign({});
    public walletMgmtNoAutopayService:WalletMgmtNoAutopayService = Object.assign({});
    private currentPaymentType = '';
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    public isPaymentInstrumentCalled = false;
    private dataLayerService:DataLayerService = Object.assign({});

    constructor(cardOnlyWebComponent:CardOnlyWebComponent,cardOnlyService:CardOnlyService,cardOnlyEditService:CardOnlyEditService, careServiceCC:CareService, formValidationService:FormValidationService, validationService:Validation, walletMgmtNoAutopayService:WalletMgmtNoAutopayService){
        super(validationService,cardOnlyService.config);
        this.formValidationService = new FormValidationService();
        this.formValidationService.paymentType = PaymentType.CardOnly;
        this.cardOnlyWebComponent = cardOnlyWebComponent;
        this.cardOnlyService = cardOnlyService;    
        this.cardOnlyEditService = cardOnlyEditService;
        this.walletMgmtNoAutopayService = walletMgmtNoAutopayService;
        this.dataLayerService = new DataLayerService();
        this.careServiceCC = careServiceCC;
        this.labelService = new LabelService();
        this.labelText = new Map<string,string>();
    }
    handleComponentLoaded(){
        console.log('inside card-only-vm');
        //this.cardOnlyService.viewModel.templateContent = this.cardOnlyWebComponent.templateContent;
        this.viewModel = this.cardOnlyService.viewModel;
        this.viewModel.personalInfo = Object.assign({});
        this.viewModel.cardInfo = Object.assign({});
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        this.currentPaymentType = this.cardOnlyService.config.cpcPageType.toString();

        if(this.cardOnlyService.channel.channelData.customerDetails.paymentToken && this.currentPaymentType === PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase() && this.currentPaymentType !== PaymentType[PaymentType.CardOrExisting].toLowerCase()){
            //this.cardOnlyEditService = new CardOnlyEditService();
            this.cardOnlyEditService.viewModel = this.cardOnlyService.viewModel;
            this.cardOnlyEditService.config = this.cardOnlyService.config;
            this.cardOnlyEditService.inputReference = this.inputReference;
            this.cardOnlyEditService.formValidationService = this.formValidationService;
            //this.cardOnlyEditService.formValidationService.setContent();
            //this.cardOnlyEditService.getExistingPaymentInstrument();   
        }
        
        if(this.cardOnlyService.channel.channelData.config?.iguard?.enableIguardIntegration){
            this.careServiceCC.viewModel = this.cardOnlyService.viewModel;
            this.careServiceCC.config = this.cardOnlyService.config;
            this.careServiceCC.inputReference = this.inputReference;
            this.careServiceCC.formValidationService = this.formValidationService;
            this.careServiceCC.displayCareActions();
        }
        if((this.currentPaymentType === PaymentType[PaymentType.WalletMgmtNoAutopay].toLowerCase() || this.currentPaymentType === PaymentType[PaymentType.CardExpirationEdit].toLowerCase()) && this.currentPaymentType !== PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase() && this.currentPaymentType !== PaymentType[PaymentType.CardOrExisting].toLowerCase()){
            this.walletMgmtNoAutopayService.viewModel = this.cardOnlyService.viewModel;
            this.walletMgmtNoAutopayService.config = this.cardOnlyService.config;
            this.walletMgmtNoAutopayService.formValidationService = this.formValidationService;
            this.cardListSubmit();
        }
        this.setElementReference();
        const cpcPageType:string = this.global.appState.get('config').cpcPageType.toLowerCase();
        enableManualEntry(this.cardOnlyService?.channel?.channelData?.config?.enableManualEntry, this.inputReference.cc, cpcPageType);
        this.inputReference.cc.disabled = this.isCardFieldDisabled(this.currentPaymentType,this.cardOnlyService.channel?.channelData?.config?.disableCardChange);
        this.inputReference.cvv.disabled = true;  
        this.checkToRunBindEvent();
    }
    isCardFieldDisabled(currentPageType:string, isDisabled:any):boolean {
        let flag = false;
        if(currentPageType?.toLowerCase() === CARD_ONLY_WITH_EDIT?.toLowerCase() && isDisabled === true) {
            flag = true;
        }
        return flag;
    }
    handleErrMessageLoaded(pageType:string){
        this.executeBindEvent('handleErrMessageLoaded - card-only-vm-service.ts' + ' ' + pageType);
    }    
    handleReset(){
        console.log('jump-cc-component-reset');
        this.reset();
    }

    setElementReference(){  
        console.log('setElementReference cc');
        const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputRefPair.push({key: 'firstName', value:'#jump-card-only-container [name="jump-first-name"]'});
        inputRefPair.push({key: 'lastName', value:'#jump-card-only-container [name="jump-last-name"]'});
        inputRefPair.push({key: 'cc', value:'#jump-card-only-container [name="jump-credit-card"]'});
        inputRefPair.push({key: 'expMM', value:'#jump-card-only-container [name="jump-expiry-mm"]'});
        inputRefPair.push({key: 'expYY', value:'#jump-card-only-container [name="jump-expiry-yy"]'});
        inputRefPair.push({key: 'cvv', value:'#jump-card-only-container [name="jump-cvv"]'});        
        inputRefPair.push({key: 'ccImg', value:'#jump-card-only-container [name="jump-credit-card-img"]'});
        inputRefPair.push({key: 'jumpModalTrigger', value:'#jump-card-only-container [name="jump-modal-trigger"]'});
        inputRefPair.push({key: 'ccTemplateContainer', value:'#jump-card-only-container [name="jump-cc-template-container"]'});
        this.formValidationService.setElementReference(inputRefPair);

    }
    cardListSubmit():void {
        const saveButtonCC = document.querySelector('#' + 'cardListPlaceholderCard' + ' [id="jump-save-option-cc"]');
        saveButtonCC?.addEventListener('click', () => {
            this.submit('');
        });

        const cancelButtonCC = document.querySelector('#' + 'cardListPlaceholderCard' + ' [id="jump-cancel-option-cc"]');
        cancelButtonCC?.addEventListener('click', () => {
            const cardContainer = document.querySelector('#cardListPlaceholderCard [name="jump-card-container"]');
            this.reset();
            cardContainer?.classList.remove('show');
            cardContainer?.classList.add('d-none');
            this.dataLayerService.dispatchInfoEvent(CPC_WALLET_MGMT_NO_AUTOPAY_CARD_FORM_CANCELED, true);
        });  
    }
    submit(e:any){    
        console.log('bind card-only-vm');
        console.log('this.model.channel.channelData.selectedPaymentType ',this.cardOnlyService.channel.channelData.selectedPaymentType) ;
        const pageType:PaymentType = this.cardOnlyService.config.cpcPageType;        
        if(this.cardOnlyService.channel.channelData.selectedPaymentType === 'cardonly'){            
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
            this.global.updateVmMap.set(CARD_COMPONENT,false);
            const cardVm:IViewModel = Object.assign({});
            cardVm.cardInfo = Object.assign({});
            cardVm.cardInfo.ccNo = this.inputReference?.cc?.value;
            cardVm.cardInfo.expMonth = this.inputReference?.expMM?.value; 
            cardVm.cardInfo.expYear = this.inputReference?.expYY?.value;
            cardVm.cardInfo.cvv = this.inputReference?.cvv?.value;
            cardVm.cardInfo.cardType = getCardType(this.inputReference.cc.value);
            cardVm.personalInfo = Object.assign({});
            cardVm.personalInfo.firstName = this.inputReference?.firstName?.value;
            cardVm.personalInfo.lastName = this.inputReference?.lastName?.value;
            if (e?.detail?.data?.channelData) {
                cardVm.formSubmitChannelData = e.detail.data.channelData;
                cardVm.walletId =  e?.detail?.data?.channelData?.customerDetails?.walletId;
            } else {
                cardVm.formSubmitChannelData = this.cardOnlyService?.channel?.channelData;
                cardVm.walletId = this.cardOnlyService.channel?.channelData?.customerDetails?.walletId;
            }

            if(this.careServiceCC.isIguardUtilized){
                if(this.careServiceCC.validate(false, CC)){
                    this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:CC,data:cardVm }});
                }
            }else{
                if(this.cardOnlyService.channel.channelData.customerDetails.paymentToken && pageType.toString()===PaymentType[PaymentType.CardOnlyWithEdit].toString().toLowerCase()){
                    if(this.cardOnlyEditService.validate()){
                        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:CC,data:cardVm }});                
                    } 
                }else {
                    if(this.validate()){
                        this.global.actionObserverService.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:CC,data:cardVm }});                
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
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        
        this.formValidationService.bindOnBlur();
        this.formValidationService.bindKeyup(['firstName','lastName','cvv','cc']);
        this.formValidationService.bindPaste(['cc', 'cvv']);
        this.formValidationService.bindChange(['expMM','expYY']);  
        this.formValidationService.bindFocusOut(['expMM','expYY', 'cvv']); 
        if(!this.inputReference.expYY.value) {
            this.fillExpiryYear();
        }
        //this.setViewModel();
        this.changeLabel();
        this.launchModalPopup();
        const cvvIcon = this.getElementRef('[name="jump-cvv-icon"]');
        setPopupIcon(cvvIcon,'cvv');
        //this.labelService.viewModel = this.viewModel;
        if(this.cardOnlyService.channel.channelData.channelDetails.customerClass?.toLowerCase() === 'business'){
            if( this.currentPaymentType.toLowerCase() === PaymentType[PaymentType.CardOnly].toLowerCase()){
                this.labelText.set('jump-first-name-label', this.getCPCContent(CPCContentType.customer_class_business, CPCContentType.card_only_base_template, CPCContentType.first_name));
                this.labelText.set('jump-last-name-label', this.getCPCContent(CPCContentType.customer_class_business, CPCContentType.card_only_base_template, CPCContentType.last_name));
            } else{
                this.labelText.set('jump-first-name-label', LABEL_FIRST_NAME);
                this.labelText.set('jump-last-name-label', LABEL_LAST_NAME);
            }
           
        }else{
            if( this.currentPaymentType.toLowerCase() === PaymentType[PaymentType.CardOnly].toLowerCase()){
                this.labelText.set('jump-first-name-label', this.getCPCContent(CPCContentType.customer_class_residential, CPCContentType.card_only_base_template, CPCContentType.first_name));
                this.labelText.set('jump-last-name-label',  this.getCPCContent(CPCContentType.customer_class_residential, CPCContentType.card_only_base_template, CPCContentType.last_name));
            }
        }
        this.labelService.changeLabel( this.labelText);    
        if(!this.isPaymentInstrumentCalled && this.currentPaymentType.toLowerCase() === PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase() && this.cardOnlyEditService.channel.channelData?.customerDetails?.paymentToken) {
            this.cardOnlyEditService.getExistingPaymentInstrument();
            this.isPaymentInstrumentCalled = true;
        }
       
        const defaultSelectedPaymentType = this.global.appState.get('channelData')?.config?.defaultSelectedPaymentType?.toLowerCase();
        const ccOption = document.querySelector('[id="jump-cc-type"]');
        if(defaultSelectedPaymentType === CARD) {
            ccOption?.setAttribute('checked','true');
            ccOption?.dispatchEvent(new Event('click'));
        } 
        if(cpcPageType === CARD_ONLY_WITH_EDIT.toLowerCase()) {
            this.addressOnEdit();
        } 
    }
    addressOnEdit() {
        const addressOption = '#jump-cc-web-component [aria-describedby="newAddressOptionCc-jump-existing-address-info-label"]';  
        const addressOptionCheckbox = waitForElementToLoad(addressOption).then((addressOptionElement:any) => {
            addressOptionElement.addEventListener('click', ()=> {
                this.cardOnlyEditService.getExistingPaymentInstrument(CC);
            });
        });
    }
    launchModalPopup(){
        const modalPopupTitle = document.getElementById('jumpModalTitle');
        const modalPopupBody = document.getElementById('jumpModalBody');      
      
        this.inputReference.jumpModalTrigger.addEventListener('click', () => {
            console.log('modal clicked!');
            if(modalPopupTitle){
                modalPopupTitle.innerHTML = CVV_POPUP_TITLE;
            }
            if(modalPopupBody){
                modalPopupBody.innerHTML = CVV_POPUP_CONTENT;
            }        
        });
    }
    changeLabel(){
        if(!this.cardOnlyService.config.cpcPageLabelCase) return;
        switch (this.cardOnlyService.config.cpcPageLabelCase.toString().toLowerCase()){
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
    setInputFieldErrMap(){
        const inputFieldErrPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();

        inputFieldErrPair.push({key:'firstName', value:this.getErrorMessage(ErrorType.first_name,ErrorType.no_value)});
        inputFieldErrPair.push({key:'lastName', value:this.getErrorMessage(ErrorType.last_name,ErrorType.no_value)});
        inputFieldErrPair.push({key:'cc', value:this.getErrorMessage(ErrorType.card_number,ErrorType.invalid)});
        inputFieldErrPair.push({key:'expMM', value:this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past)});        
        inputFieldErrPair.push({key:'expYY', value:this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past)});        
        inputFieldErrPair.push({key:'cvv', value:this.getErrorMessage(ErrorType.security_code,ErrorType.invalid)});  
        if(this.validationService.isSetStoredPayment()) {
            inputFieldErrPair.push({key:'storedPayment', value:this.getErrorMessage(ErrorType.stored_payment, ErrorType.invalid)});
            inputFieldErrPair.push({key:USER_ROLE_ERROR_MAP, value:this.getErrorMessage(ErrorType.userrole, ErrorType.no_value)});
            const autoPayCheckbox = this.inputReference?.enrollInAutoPay;
            this.formValidationService.autoPayChangeCC(autoPayCheckbox, this.inputReference?.storedPayment);
        }
        this.formValidationService.initFormErrorMap(inputFieldErrPair);
        //this.bindOnBlur(inputFieldErrPair);

        if(this.cardOnlyService?.channel.channelData?.channelDetails?.customerClass === CUSTOMER_CLASS_BUSINESS){
            this.formValidationService.setErrorMap('lastName', true);
        }
        // if(this.model?.channel.channelData?.editForm?.firstName){
        //     this.formValidationService.setErrorMap('firstName', true);
        // }
        // if(this.model?.channel.channelData?.editForm?.lastName){
        //     this.formValidationService.setErrorMap('lastName', true);
        // }
    }
    validate(): boolean {
        let flag = true;
        this.formFieldStatusMap.set('default', flag);
        if(this.validationService.isSetStoredPayment()) {
            this.removeErrorNodes(['firstName','lastName','cc','expMM','expYY','cvv', 'storedPayment']);
        } else {
            this.removeErrorNodes(['firstName','lastName','cc','expMM','expYY','cvv']);
        }
        if(this.inputReference?.firstName?.value) {            
            const isValid = flag = this.validationService.validateFirstName(
                this.inputReference.firstName.value, 
                this.cardOnlyService.channel?.channelData?.channelDetails?.customerClass
            ).isValid;
            if(isValid){               
                //this.viewModel.firstName = this.inputReference.firstName.value;   
                this.inputReference.firstName.classList.remove('is-invalid');
            }else{
                this.inputReference.firstName.classList.add('is-invalid');
                this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback(this.inputReference.firstName,this.getErrorMessage(ErrorType.first_name,ErrorType.invalid)));
            }
        } else {
            flag = false;
            this.inputReference.firstName.classList.add('is-invalid');
            this.inputReference.firstName?.parentElement.append(this.appendErrorFeedback(this.inputReference.firstName,this.getErrorMessage(ErrorType.first_name,ErrorType.no_value)));
            console.log(this.getErrorMessage(ErrorType.first_name,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('firstName', flag);

        if(this.inputReference?.lastName?.value) {
            const isValid = flag = this.validationService.validateLastName(
                this.inputReference.lastName.value, 
                this.cardOnlyService.channel?.channelData?.channelDetails?.customerClass,PaymentType[PaymentType.CardOnly].toLowerCase()
            ).isValid;
            if(isValid){               
                //this.viewModel.lastName = this.inputReference.lastName.value;
                this.inputReference.lastName.classList.remove('is-invalid');
            }else{
                this.inputReference.lastName.classList.add('is-invalid');
                this.inputReference.lastName?.parentElement.append(this.appendErrorFeedback(this.inputReference.lastName, this.getErrorMessage(ErrorType.last_name,ErrorType.invalid)));
            }
        } else if(this.cardOnlyService.channel?.channelData?.channelDetails?.customerClass === CUSTOMER_CLASS_BUSINESS 
        && !this.inputReference.lastName.value){
            flag = flag ? true : flag;
        } else{
            flag = false;
            this.inputReference.lastName.classList.add('is-invalid');
            this.inputReference.lastName?.parentElement.append(this.appendErrorFeedback(this.inputReference.lastName, this.getErrorMessage(ErrorType.last_name,ErrorType.no_value)));
            console.log(this.getErrorMessage(ErrorType.last_name,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('lastName', flag);

        if(this.inputReference?.cc?.value) {
            const result = this.validationService.validateCC(this.inputReference.cc.value);
            flag = result.isValid;
            if(!result.isValid){
                this.inputReference.cvv.disabled = true;
                this.inputReference.cc.classList.add('is-invalid');
                this.inputReference.cc?.parentElement.append(this.appendErrorFeedback(this.inputReference.cc, this.getErrorMessage(ErrorType.card_number,result.errorType)));
            }else{
                //this.viewModel.ccNo = this.inputReference.cc.value;
                this.inputReference.cc.classList.remove('is-invalid');
                this.inputReference.cvv.disabled = false;
            }
        } else {
            flag = false;
            this.inputReference.cc.classList.add('is-invalid');
            this.inputReference.cc?.parentElement.append(this.appendErrorFeedback(this.inputReference.cc, this.getErrorMessage(ErrorType.card_number,ErrorType.no_value)));
            console.log(this.getErrorMessage(ErrorType.card_number,ErrorType.no_value));
        }
        this.formFieldStatusMap.set('cc', flag);

        if(this.inputReference?.expMM?.value) {
            const isValid = flag = this.validationService.validateExpMM(this.inputReference.expMM.value,this.inputReference.expYY.value);
            if(isValid){            
                //this.viewModel.expMonth = this.inputReference.expMM.value;
                this.inputReference.expMM.classList.remove('is-invalid');
            }else{
                this.inputReference.expMM.classList.add('is-invalid');
                this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback(this.inputReference.expMM, this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past)));
            }
        } else {
            flag = false;
            this.inputReference.expMM.classList.add('is-invalid');
            if(this.inputReference.expYY.value === ''){
                this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback(this.inputReference.expMM, this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.no_value)));
            } else {
                this.inputReference.expMM?.parentElement.append(this.appendErrorFeedback(this.inputReference.expMM, this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.no_value)));
            }
            console.log(this.getErrorMessage(ErrorType.expiration_month_year,ErrorType.date_in_past));
        }
        this.formFieldStatusMap.set('expMM', flag);

        if(this.inputReference?.expYY?.value) {
            const isValid = flag = this.validationService.validateExpYY(this.inputReference.expYY.value,this.inputReference.expMM.value);
            if(isValid){                                
                //this.viewModel.expYear = this.inputReference.expYY.value;
                this.inputReference.expYY.classList.remove('is-invalid');
            }else{
                flag = false;
                this.inputReference.expYY.classList.add('is-invalid');
            }
        } else {
            flag = false;
            this.inputReference.expYY.classList.add('is-invalid');
        }
        this.formFieldStatusMap.set('expYY', flag);

        if(this.inputReference?.cvv?.value) {
            const result = this.validationService.validateExpCvv(this.inputReference.cvv.value, this.inputReference.cc.value);
            flag = result.isValid;
            if(result.isValid){                              
                //this.viewModel.cvv = this.inputReference.cvv.value;
                this.inputReference.cvv.classList.remove('is-invalid');
            }else{
                this.inputReference.cvv.classList.add('is-invalid');
                this.inputReference.cvv?.parentElement.append(this.appendErrorFeedback(this.inputReference.cvv, this.getErrorMessage(ErrorType.security_code,result.errorType)));
            }
        } else {
            flag = false;
            this.inputReference.cvv.classList.add('is-invalid');
            this.inputReference.cvv?.parentElement.append(this.appendErrorFeedback(this.inputReference.cvv, this.getErrorMessage(ErrorType.security_code,ErrorType.no_value)));
            console.log(this.getErrorMessage(ErrorType.security_code,ErrorType.no_value));
        } 
        this.formFieldStatusMap.set('cvv', flag);
        if(this.validationService.isSetStoredPayment()) {
            // if(!this.inputReference?.storedPayment) {
            const storedPaymentCCElement = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
            this.inputReference.storedPayment = storedPaymentCCElement;
            if(this.inputReference?.storedPayment.checked){
                const userrole = getUserRoleUtil(new ChannelService(this.cardOnlyService.channel.channelData), 'cc', this.cardOnlyService.channel.channelData.customerDetails.walletId);
                const componnetId = '#jump-cc-web-component [id="jump-userrole-list"]';
                const element = document.querySelector(componnetId);
                this.removeErrorUserroleFeedback(element, 'jump-userrole-list-cc');
                if(this.validationService.isUserRoleValid(userrole, CC)){
                    flag = true;
                    this.formValidationService.setErrorMap(USER_ROLE_ERROR_MAP, true);
                    element?.parentElement?.classList.remove('jump-userrole-invalid-feedback');
                }else{
                    flag =false;
                    this.formValidationService.setErrorMap(USER_ROLE_ERROR_MAP, false);
                    element?.parentElement?.classList.add('jump-userrole-invalid-feedback');
                    element?.parentElement?.append(this.appendErrorUserroleFeedback('jump-userrole-list-cc', this.getErrorMessage(ErrorType.userrole,ErrorType.no_value)));
                }
            }
            // }
            this.formFieldStatusMap.set('userrole', flag);
        }

        if(this.validationService.isSetStoredPayment()) {
            if (this.inputReference?.storedPayment) { 
                const result = this.validationService.validateAutoPayAndStoredPaymentCC();
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
                // console.log(this.getErrorMessage(ErrorType.form, ErrorType.stored_payment));
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
    fillExpiryYear(): void {
        const currentYear = new Date().getFullYear();
        let options = '<option value="" disabled selected>Year</option>';
        for (let i = 0; i < 10; i++) {
            options =
          options +
          `<option value="${currentYear + i}">${currentYear + i}</option>`;
        }
        if(this.inputReference?.expYY){
            this.inputReference.expYY.innerHTML = options;
        }
    }   
    removeErrorNodes(arrInputRef:Array<string>){
        arrInputRef.forEach(item=>{
            this.removeErrorFeedback(this.inputReference[item as keyof IInputReference]);
        });     
    }
    reset(){        
        if(!this.cardOnlyService.channel.channelData?.editForm) {
            this.viewModel.personalInfo.firstName = this.inputReference.firstName.value = '';            
            this.viewModel.personalInfo.lastName = this.inputReference.lastName.value = '';            
        }
        // if(this.viewModel?.channelData?.editForm?.firstName) {
        //     this.viewModel.channelData.editForm.firstName = '';
        //     this.formValidationService.setErrorMap('firstName', false);
        // }else{
        //     this.viewModel.firstName = this.inputReference.firstName.value = '';
        // }
        // if(this.viewModel?.channelData?.editForm?.lastName) {
        //     this.viewModel.channelData.editForm.lastName = '';
        //     this.formValidationService.setErrorMap('lastName', false);
        // }else{
        //     this.viewModel.lastName = this.inputReference.lastName.value = '';
        // }

        this.inputReference.firstName.classList.remove('is-invalid');
        this.removeErrorFeedback('firstName');
        this.inputReference.lastName.classList.remove('is-invalid');
        this.removeErrorFeedback('lastName');

        this.viewModel.cardInfo.ccNo = this.inputReference.cc.value = '';
        this.inputReference.cc.classList.remove('is-invalid');
        this.removeErrorFeedback('cc');

        //this.viewModel.expMonth = '';
        this.inputReference.expMM.value = '';
        this.inputReference.expMM.classList.remove('is-invalid');
        this.removeErrorFeedback('expMM');

        //this.viewModel.expYear = '';
        this.inputReference.expYY.value = '';      
        this.inputReference.expYY.classList.remove('is-invalid');
        this.removeErrorFeedback('expYY');

        this.viewModel.cardInfo.cvv = this.inputReference.cvv.value = '';
        this.inputReference.cvv.disabled = true;  
        this.inputReference.cvv.classList.remove('is-invalid');
        this.removeErrorFeedback('cvv');

        const cardOnly: any = document.getElementById(
            'jump-error-web-component-cc'
        );
        if(!this.inputReference?.storedPayment) {
            const storedPaymentCCElement = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
            this.inputReference.storedPayment = storedPaymentCCElement;
            this.inputReference?.storedPayment?.classList?.remove('is-invalid');
        } else {
            this.inputReference?.storedPayment?.classList?.remove('is-invalid');
        }
        if(cardOnly){
            cardOnly.innerHTML ='';
        }
        const cardImage: any = document.querySelector('[name="jump-credit-card-img"]');
        if(cardImage){
            cardImage.innerHTML ='';
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
        case ErrorType.security_code:
            if(subKey === ErrorType.american_express || subKey === ErrorType.discover || subKey === ErrorType.mastercard|| subKey === ErrorType.visa){
                errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,ErrorType.not_enough_digits,subKey);
            }else if(subKey === ErrorType.alpha_characters){
                errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,subKey);
            }else {
                errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,ErrorType.security_code,ErrorType.invalid);
            }            
            break;
        case ErrorType.stored_payment:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.stored_payment,ErrorType.invalid);
            break; 
        case ErrorType.userrole:  
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.userrole,ErrorType.no_value);
            break;          
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,ErrorType.card,key,subKey);
            break;
        }
        return errorMessage;
    } 
    getCPCContent(customerClass:string, template:string, key:string, subKey?:string): string {  
        let getTitle = '';
        switch(key){          
        case CPCContentType.first_name  :            
            getTitle = this.global.getContent(template, customerClass, CPCContentType.first_name);
            break;
        case CPCContentType.last_name  :            
            getTitle = this.global.getContent(template, customerClass, CPCContentType.last_name);
            break;
        }
        return getTitle;
    }
}
