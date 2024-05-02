import { Validation } from '../../utils/validation';
import { Globals } from '../../utils/globals';
import { JUMP_ACCOUNT_TYPE_COMPONENT_RESET, JUMP_ACH_ADDRESS_COMPONENT_RESET, JUMP_ACH_COMPONENT_LOADED, JUMP_ACH_COMPONENT_RESET, JUMP_ACH_TYPE_COMPONENT_LOADED, JUMP_CARD_LIST_COMPONENT_LOADED, JUMP_CC_ADDRESS_COMPONENT_RESET, JUMP_CC_COMPONENT_LOADED, JUMP_CC_COMPONENT_RESET, JUMP_ERROR_MESSAGE_LOADED, JUMP_MIN_ACH_COMPONENT_LOADED, JUMP_MIN_COMPONENT_LOADED, JUMP_AUTO_PAY_COMPONENT_RESET, JUMP_TC_COMPONENT_RESET, JUMP_CC_AUTO_PAY_COMPONENT_LOADED, JUMP_ACH_AUTO_PAY_COMPONENT_LOADED, JUMP_CC_TC_COMPONENT_LOADED, JUMP_ACH_TC_COMPONENT_LOADED, JUMP_CC_DEFAULT_PAYMENT_COMPONENT_LOADED, JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_RESET, JUMP_CC_DEFAULT_PAYMENT_COMPONENT_RESET, JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_LOADED, JUMP_ADDRESS_OPTION_COMPONENT_LOADED,
    CARD_ONLY_VIEWMODAL_SERVICE, ACH_ONLY_VIEWMODAL_SERVICE, ACCOUNT_TYPE_VIEWMODAL_SERVICE, ADDRESS_ONLY_VIEWMODAL_SERVICE, MIN_CARD_ONLY_VIEWMODAL_SERVICE, MIN_ACH_ONLY_VIEWMODAL_SERVICE, CARD_LIST_VIEWMODAL_SERVICE, AUTO_PAY_VIEWMODAL_SERVICE, TERMS_AND_CONDITION_VIEWMODAL_SERVICE, DEFAULT_PAYMENT_VIEWMODAL_SERVICE, CARD_ONLY_WEB_COMPONENT, ACH_ONLY_WEB_COMPONENT, ADDRESS_WEB_COMPONENT_CC, ADDRESS_WEB_COMPONENT_ACH, AUTO_PAY_WEB_COMPONENT_CC, AUTO_PAY_WEB_COMPONENT_ACH, CARD_LIST_WEB_COMPONENT, DEFAULT_PAYMENT_WEB_COMPONENT_CC, DEFAULT_PAYMENT_WEB_COMPONENT_ACH, TERMS_WEB_COMPONENT_CC, TERMS_WEB_COMPONENT_ACH, MIN_ACH_ONLY_WEB_COMPONENT, MIN_CARD_ONLY_WEB_COMPONENT, ACCOUNT_TYPE_WEB_COMPONENT, JUMP_PAYMENT_CLICKED, ACH, CC, CARD, JUMP_CC_CARE_COMPONENT_LOADED, CARE_WEB_COMPONENT_CC, CARE_WEB_COMPONENT_ACH, JUMP_CARE_COMPONENT_RESET, JUMP_ACH_CARE_COMPONENT_LOADED, CARE_VIEWMODAL_SERVICE, USERROLE_LIST_WEB_COMPONENT_CC, USERROLE_LIST_WEB_COMPONENT_ACH, JUMP_CC_USERROLE_COMPONENT_RESET, JUMP_ACH_USERROLE_COMPONENT_RESET, JUMP_CC_USERROLE_LIST_COMPONENT_LOADED, JUMP_ACH_USERROLE_LIST_COMPONENT_LOADED, USERROLE_LIST_VIEWMODAL_SERVICE} from '../../constant/app.constant';
import { IConfig } from '../../model/view.model';
import { IPersonalInfoModel } from '../../model/personal-info-model';
/*
 * 1- All the service dependencies should be pass to the constructor of this service.
 * 2- Globals, utils, models, view modles, constants can be imported directly.
 * 3- All DOM manipulation should be done in CardOnlyViewModelService service.
 */
export class BaseViewModelService{    
    public formFieldStatusMap:Map<string, boolean>;
    public validationService:Validation;
    public global:Globals;    
    public componentConfig:IConfig = Object.assign({});
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    constructor(validationService:Validation,componentConfig?:IConfig){
        console.log('base-vm-service component..');
        this.global = Globals.getInstance();
        if(componentConfig){
            this.componentConfig = componentConfig;
        }        
        document.addEventListener(JUMP_PAYMENT_CLICKED, (e)=>{ this.baseSubmit(e);});
        this.listenExternalEvent();        
        this.formFieldStatusMap = new Map<string,boolean>();
        this.validationService = validationService;
    }
    listenExternalEvent(): void {  
        if(this.constructor.name === CARD_ONLY_VIEWMODAL_SERVICE ){ 
            this.cardOnlySubscription();
        } else if(this.constructor.name === ACH_ONLY_VIEWMODAL_SERVICE){
            this.achOnlySubscription();
        } else if(this.constructor.name === ACCOUNT_TYPE_VIEWMODAL_SERVICE){
            this.accountTypeSubscription();
        } else if(this.constructor.name === ADDRESS_ONLY_VIEWMODAL_SERVICE){
            this.addressOnlySubscription();
        } else if(this.constructor.name === MIN_CARD_ONLY_VIEWMODAL_SERVICE){
            this.minCardOnlySubscription();
        } else if(this.constructor.name === MIN_ACH_ONLY_VIEWMODAL_SERVICE){
            this.minAchOnlySubscription();
        } else if(this.constructor.name === CARD_LIST_VIEWMODAL_SERVICE){
            this.cardListViewModelSubscription();
        } else if(this.constructor.name === AUTO_PAY_VIEWMODAL_SERVICE){
            this.autoPayViewSubcription();
        } else if(this.constructor.name === TERMS_AND_CONDITION_VIEWMODAL_SERVICE){
            this.termsAndConditionViewSubcription();
        } else if(this.constructor.name === DEFAULT_PAYMENT_VIEWMODAL_SERVICE ){
            this.defaultPaymentSubcription();
        } else if(this.constructor.name === CARE_VIEWMODAL_SERVICE ){
            this.careViewSubcription();
        } else if(this.constructor.name === USERROLE_LIST_VIEWMODAL_SERVICE ){
            this.userroleListSubcription();
        }  

    }
    addressOnlySubscription(): void {                
        const isSubscribeCC =  this.global.subscriptionMap.get(CARD_ONLY_WEB_COMPONENT);
        const isSubscribeAddCC =  this.global.subscriptionMap.get(ADDRESS_WEB_COMPONENT_CC);
        const isSubscribeAch =  this.global.subscriptionMap.get(ACH_ONLY_WEB_COMPONENT);
        const isSubscribeAddAch =  this.global.subscriptionMap.get(ADDRESS_WEB_COMPONENT_ACH);

        if(isSubscribeCC && !isSubscribeAddCC){
            this.addressOnlySubscriptionCc();
        } else if(isSubscribeAch && !isSubscribeAddAch){
            this.addressOnlySubscriptionAch();
        }                        
    }
    userroleListSubcription(): void {                
        const isSubscribeCC =  this.global.subscriptionMap.get(CARD_ONLY_WEB_COMPONENT);
        const isSubscribeAddCC =  this.global.subscriptionMap.get(USERROLE_LIST_WEB_COMPONENT_CC);
        const isSubscribeAch =  this.global.subscriptionMap.get(ACH_ONLY_WEB_COMPONENT);
        const isSubscribeAddAch =  this.global.subscriptionMap.get(USERROLE_LIST_WEB_COMPONENT_ACH);
        console.log;
        if(isSubscribeCC && !isSubscribeAddCC){
            this.userroleListSubscriptionCc();
        } else if(isSubscribeAch && !isSubscribeAddAch){
            this.userroleListSubscriptionAch();
        }                        
    }
    autoPayViewSubcription(): void {    
        const isSubscribeCC =  this.global.subscriptionMap.get(CARD_ONLY_WEB_COMPONENT);
        const isSubscribeAddCC =  this.global.subscriptionMap.get(AUTO_PAY_WEB_COMPONENT_CC);
        const isSubscribeAch =  this.global.subscriptionMap.get(ACH_ONLY_WEB_COMPONENT);
        const isSubscribeAddAch =  this.global.subscriptionMap.get(AUTO_PAY_WEB_COMPONENT_ACH);
        const isSubcribeCardList = this.global.subscriptionMap.get(CARD_LIST_WEB_COMPONENT);
        
        if(isSubcribeCardList && !isSubscribeAddCC) {
            this.autoPayViewSubcriptionCc();
        }
        if(isSubscribeCC && !isSubscribeAddCC){
            this.autoPayViewSubcriptionCc(); 
        } else if(isSubscribeAch && !isSubscribeAddAch){
            this.autoPayViewSubcriptionAch();
        } 
    }
    defaultPaymentSubcription(): void {    
        const isSubscribeCC =  this.global.subscriptionMap.get(CARD_ONLY_WEB_COMPONENT);
        const isSubscribeAddCC =  this.global.subscriptionMap.get(DEFAULT_PAYMENT_WEB_COMPONENT_CC);
        const isSubscribeAch =  this.global.subscriptionMap.get(ACH_ONLY_WEB_COMPONENT);
        const isSubscribeAddAch =  this.global.subscriptionMap.get(DEFAULT_PAYMENT_WEB_COMPONENT_ACH);
   
        if(isSubscribeCC && !isSubscribeAddCC){
            this.defaultPaymentSubcriptionCc(); 
        } else if(isSubscribeAch && !isSubscribeAddAch){
            this.defaultPaymentSubcriptionAch();
        } 
    }
    termsAndConditionViewSubcription(): void {    
        const isSubscribeCC =  this.global.subscriptionMap.get(CARD_ONLY_WEB_COMPONENT);
        const isSubscribeAddCC =  this.global.subscriptionMap.get(TERMS_WEB_COMPONENT_CC);
        const isSubscribeAch =  this.global.subscriptionMap.get(ACH_ONLY_WEB_COMPONENT);
        const isSubscribeAddAch =  this.global.subscriptionMap.get(TERMS_WEB_COMPONENT_ACH);

        if(isSubscribeCC && !isSubscribeAddCC){
            this.termsViewSubcriptionCc(); 
        } else if(isSubscribeAch && !isSubscribeAddAch){
            this.termsViewSubcriptionAch();
        } 
    }
    careViewSubcription(): void {    
        const isSubscribeCC =  this.global.subscriptionMap.get(CARD_ONLY_WEB_COMPONENT);
        const isSubscribeAddCC =  this.global.subscriptionMap.get(CARE_WEB_COMPONENT_CC);
        const isSubscribeAch =  this.global.subscriptionMap.get(ACH_ONLY_WEB_COMPONENT);
        const isSubscribeAddAch =  this.global.subscriptionMap.get(CARE_WEB_COMPONENT_ACH);

        if(isSubscribeCC && !isSubscribeAddCC){
            this.careViewSubcriptionCc(); 
        } else if(isSubscribeAch && !isSubscribeAddAch){
            this.careViewSubcriptionAch();
        } 
    }
    setupSubcription(subscriptionMapKey:string, componentLoadedEventName:string,formType:string, componentResetEventName='') : void {
        const isSubscribe =  this.global.subscriptionMap.get(subscriptionMapKey);
        if(!isSubscribe){
            this.global.actionObserverService?.subscribe((sender:any,data:any)=>{
                switch(data.detail.action){
                case JUMP_ERROR_MESSAGE_LOADED:
                    this.handleErrMessageLoaded(formType);
                    break;  
                case componentLoadedEventName:
                    if(componentLoadedEventName === JUMP_ADDRESS_OPTION_COMPONENT_LOADED) {
                        this.handleAddressComponentLoaded(data.detail.componentId);
                    } else {
                        this.handleComponentLoaded();
                    }
                    console.log('Subscription loaded ' + subscriptionMapKey,sender.constructor.name,data);
                    break;                             
                case componentResetEventName:
                    if(componentResetEventName !== '') {
                        this.handleReset();
                    }
                    break;
                }
            }); 
            this.global.subscriptionMap.set(subscriptionMapKey,true);
        }
    }
    achOnlySubscription(): void { 
        this.setupSubcription(ACH_ONLY_WEB_COMPONENT,JUMP_ACH_COMPONENT_LOADED, ACH, JUMP_ACH_COMPONENT_RESET);
    }
    cardOnlySubscription(): void { 
        this.setupSubcription(CARD_ONLY_WEB_COMPONENT, JUMP_CC_COMPONENT_LOADED, CC, JUMP_CC_COMPONENT_RESET); 
    }
    cardListViewModelSubscription(): void {  
        this.setupSubcription(CARD_LIST_WEB_COMPONENT, JUMP_CARD_LIST_COMPONENT_LOADED, CARD, JUMP_ACCOUNT_TYPE_COMPONENT_RESET);
    }
    minAchOnlySubscription(): void { 
        this.setupSubcription(MIN_ACH_ONLY_WEB_COMPONENT, JUMP_MIN_ACH_COMPONENT_LOADED, ACH); 
    }
    minCardOnlySubscription(): void { 
        this.setupSubcription(MIN_CARD_ONLY_WEB_COMPONENT, JUMP_MIN_COMPONENT_LOADED, CC);
    }
    accountTypeSubscription(): void { 
        this.setupSubcription(ACCOUNT_TYPE_WEB_COMPONENT, JUMP_ACH_TYPE_COMPONENT_LOADED, ACH, JUMP_ACCOUNT_TYPE_COMPONENT_RESET);
    }
    addressOnlySubscriptionCc(): void {
        this.setupSubcription(ADDRESS_WEB_COMPONENT_CC, JUMP_ADDRESS_OPTION_COMPONENT_LOADED, CC, JUMP_CC_ADDRESS_COMPONENT_RESET);
    }
    addressOnlySubscriptionAch(): void {
        this.setupSubcription(ADDRESS_WEB_COMPONENT_ACH, JUMP_ADDRESS_OPTION_COMPONENT_LOADED, ACH, JUMP_ACH_ADDRESS_COMPONENT_RESET);
    }
    autoPayViewSubcriptionCc(): void {
        this.setupSubcription(AUTO_PAY_WEB_COMPONENT_CC, JUMP_CC_AUTO_PAY_COMPONENT_LOADED, CC, JUMP_AUTO_PAY_COMPONENT_RESET);
    }
    autoPayViewSubcriptionAch(): void {
        this.setupSubcription(AUTO_PAY_WEB_COMPONENT_ACH, JUMP_ACH_AUTO_PAY_COMPONENT_LOADED, ACH, JUMP_AUTO_PAY_COMPONENT_RESET);
    }
    defaultPaymentSubcriptionCc(): void {
        this.setupSubcription(DEFAULT_PAYMENT_WEB_COMPONENT_CC, JUMP_CC_DEFAULT_PAYMENT_COMPONENT_LOADED, CC, JUMP_CC_DEFAULT_PAYMENT_COMPONENT_RESET);
    }
    defaultPaymentSubcriptionAch(): void {
        this.setupSubcription(DEFAULT_PAYMENT_WEB_COMPONENT_ACH, JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_LOADED, ACH, JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_RESET);
    }
    termsViewSubcriptionCc() : void {    
        this.setupSubcription(TERMS_WEB_COMPONENT_CC, JUMP_CC_TC_COMPONENT_LOADED, CC, JUMP_TC_COMPONENT_RESET);
    }
    termsViewSubcriptionAch() : void {    
        this.setupSubcription(TERMS_WEB_COMPONENT_ACH, JUMP_ACH_TC_COMPONENT_LOADED, ACH, JUMP_TC_COMPONENT_RESET);
    } 
    careViewSubcriptionCc() : void {    
        this.setupSubcription(CARE_WEB_COMPONENT_CC, JUMP_CC_CARE_COMPONENT_LOADED, CC, JUMP_CARE_COMPONENT_RESET);
    }
    careViewSubcriptionAch() : void {    
        this.setupSubcription(CARE_WEB_COMPONENT_ACH, JUMP_ACH_CARE_COMPONENT_LOADED, ACH, JUMP_CARE_COMPONENT_RESET);
    } 
    userroleListSubscriptionCc(): void {
        this.setupSubcription(USERROLE_LIST_WEB_COMPONENT_CC, JUMP_CC_USERROLE_LIST_COMPONENT_LOADED, CC, JUMP_CC_USERROLE_COMPONENT_RESET);
    }
    userroleListSubscriptionAch(): void {
        this.setupSubcription(USERROLE_LIST_WEB_COMPONENT_ACH, JUMP_ACH_USERROLE_LIST_COMPONENT_LOADED, ACH, JUMP_ACH_USERROLE_COMPONENT_RESET);
    }
    handleComponentLoaded(): void {
        console.log('in function');
    }
    handleErrMessageLoaded(pageType:string): void {
        console.log('handleErrMessageLoaded from base' + ' ' + pageType);        
    }
    handleSubComponent(): void {
        console.log('in function');
    }
    handleAddressComponentLoaded(componentId:string): void {
        console.log('in function');
    }
    handleReset(): void {
        console.log('in function');
    }
    setElementReference(): void {
        console.log('in function');
    }
    baseSubmit(e:any): void {   
        console.log('base vm baseSubmit ', JSON.stringify(e.detail.data));
        this.submit(e);
    }
    submit(e:any): void {   
        console.log('base vm submit ', JSON.stringify(e.detail.data));        
    }
    setInputFieldErrMap(): void {
        console.log('in function');
    }
    removeErrorFeedback(reference:any): void {
        const parentId = reference?.parentElement; 
        const errFeedback =  reference?.name;
        if(parentId){
            const selector = `[name='${errFeedback}-feedback']`;
            if(selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
        if(reference){
            reference?.classList?.remove('is-invalid');
        }
    }
    appendErrorFeedback(reference:any, feedbackMsg: string): any {
        const nameField = reference.name;
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
    } 
    appendErrorUserroleFeedback(reference:any, feedbackMsg: string): any {
        const nameField =  reference;
        const div = document.createElement('div');
        div.setAttribute('name', nameField + '-feedback');
        div.classList.add('jump-userrole-invalid-feedback');
        div.innerHTML = feedbackMsg;
        return div;
    }  
    removeErrorUserroleFeedback(reference:any, errFeedback:string): any {
        const parentId = reference?.parentElement;
        if(parentId){
            const selector = `[name='${errFeedback}-feedback']`;
            if(selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
        }
        if(reference){
            reference?.classList?.remove('is-invalid');
        }
    }             
    getElementRef(selector: string): any {
        return document.querySelector(selector);
    }
    applyExternalCss(): void {
        const link:any = this.getElementRef('[name="jump-css-url"]');
        if (link && this.componentConfig && this.componentConfig.cpcPageCssUrl) {
            link.href = this.componentConfig.cpcPageCssUrl;
        }
    }
    checkToRunBindEvent(): void{
        if(!this.isComponentLoaded && this.isBindEventExecuted){
            this.isComponentLoaded = true;  
            this.handleErrMessageLoaded('');
        }else{
            this.isComponentLoaded = true;
            this.executeBindEvent('');  
        }
    }
    executeBindEvent(pageType:any): void {
        if(this.isComponentLoaded){
            this.applyExternalCss();
            this.bindEvents();
            console.log('ComponentLoaded Type: ', pageType);
            this.isBindEventExecuted = true;
        } 
    }
    bindEvents(): void {
        //;
    }
    getPersonalInfo(customerDetail:any):IPersonalInfoModel{
        const personalInfo:IPersonalInfoModel = Object.assign({});
        if(customerDetail){
            personalInfo.firstName = customerDetail.firstName;
            personalInfo.lastName = customerDetail.lastName;
            personalInfo.addressInfo = Object.assign({});
            if(customerDetail.addressList && customerDetail.addressList.length>0){                
                let addressInfo = Object.assign({});
                if(customerDetail.addressList[0].defaultAddress){
                    addressInfo = customerDetail.addressList[0];
                    personalInfo.addressInfo.address = addressInfo.address;
                    if(addressInfo.addressLine2 && addressInfo.addressLine2 !== 'undefined') {
                        personalInfo.addressInfo.addressLine2 = addressInfo.addressLine2;
                    } else {
                        personalInfo.addressInfo.addressLine2 = '';
                    }                   
                    personalInfo.addressInfo.city = addressInfo.city;
                    personalInfo.addressInfo.state = addressInfo.state;
                    personalInfo.addressInfo.zipCode = addressInfo.zip;

                }else if(customerDetail.addressList[1]?.defaultAddress){
                    addressInfo = customerDetail.addressList[1];
                    personalInfo.addressInfo.address = addressInfo.address;
                    if(addressInfo.addressLine2 && addressInfo.addressLine2 !== 'undefined') {
                        personalInfo.addressInfo.addressLine2 = addressInfo.addressLine2;
                    } else {
                        personalInfo.addressInfo.addressLine2 = '';
                    }
                    personalInfo.addressInfo.city = addressInfo.city;
                    personalInfo.addressInfo.state = addressInfo.state;
                    personalInfo.addressInfo.zipCode = addressInfo.zip;
                }                
                
            } else if(customerDetail.address){
                personalInfo.addressInfo.address = customerDetail.address;
                if(customerDetail.addressLine2 && customerDetail.addressLine2 !== 'undefined') {
                    personalInfo.addressInfo.addressLine2 = customerDetail.addressLine2;
                } else {
                    personalInfo.addressInfo.addressLine2 = ''; 
                }
                personalInfo.addressInfo.city = customerDetail.city;
                personalInfo.addressInfo.state = customerDetail.state;
                personalInfo.addressInfo.zipCode = customerDetail.zip;
            }          
        }        
        return personalInfo;
    }
}