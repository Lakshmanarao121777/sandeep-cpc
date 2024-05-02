import { Validation } from '../../utils/validation';
import { AddressDetails, ErrorType, IInputReference, IKeyValuePair, PaymentType } from '../../model/view.model';
import {IViewModel} from './../../model/viewModel/view-model';
import { ADDRESS_COMPONENT, CPC_BANK_ADDRESS_SELECT, CPC_CREDIT_CARD_ADDRESS_SELECT, JUMP_UPDATE_VIEW_MODEL, CPC_CARD_PRIMARY_ADDRESS_OPTION_SELECT, CPC_BANK_PRIMARY_ADDRESS_OPTION_SELECT, CPC_CARD_SECONDARY_ADDRESS_OPTION_SELECT, CPC_BANK_SECONDARY_ADDRESS_OPTION_SELECT, WALLET_MGMT_NO_AUTOPAY, CARD_EXPIRATION_EDIT, CC, ACH } from '../../constant/app.constant';
import { FormValidationService } from '../form-validation-service';
import { BaseViewModelService } from './base-vm.service';
import { AddressWebComponent } from '../../index';
import { STATES } from '../../constant/payment.constant';
import { AddressOnlyService } from '../address-only.service';
import { DataLayerService } from '../data-layer.service';
import { IAddressModel } from '../../model/address-model';
/*
 * 1- All the service dependencies should be pass to the constructor of this service.
 * 2- Globals, utils, models, view modles, constants can be imported directly.
 * 3- All DOM manipulation should be done in CardOnlyViewModelService service.
 */
export class AddressOnlyViewModelService extends BaseViewModelService{
    public view:AddressWebComponent;
    public model:AddressOnlyService; 
    public addressDetail: AddressDetails = Object.assign({}); 
    public addressFor:string;      
    public formValidationService:FormValidationService;
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    private displayAddressOverride = true;
    private isNewAddressBind = false;
    private isPrimaryAddressBind = false;
    private isSecondaryAddressBind = false;
    private dataLayerService:DataLayerService = Object.assign({});
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    constructor(view:AddressWebComponent,model:AddressOnlyService, formValidationService:FormValidationService, validationService:Validation){
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.dataLayerService = new DataLayerService();
        this.view = view;
        this.model = model;
        this.addressFor = view.addressFor.toLowerCase();
        if(this.addressFor.toLowerCase() === CC){
            //this.listenExternalEventCc();
            this.formValidationService.paymentType = PaymentType.CardOnly;
        } else if(this.addressFor.toLowerCase() === ACH){
            //this.listenExternalEventAch();
            this.formValidationService.paymentType = PaymentType.AchOnly;
        }        
        this.init();
    }
    getAddressFor(): string{
        return this.addressFor;
    }
    
    handleAddressComponentLoaded(componentId:string){
        console.log('jump-address-option-component-loaded ach');
        const addressList = this.global.appState.get('channelData').customerDetails.addressList;
        this.addressDetail = this.getAddressValues(this.model.channel.channelData.customerDetails);
        this.setElementReference();
        this.checkToRunBindEvent();
        if(!addressList) {
            this.bindOptionCheckboxTemplateToView();
        } else {
            this.bindOptionTemplateToView(componentId);
        }    
        
    }
    handleErrMessageLoaded(pageType:string){
        this.executeBindEvent('handleErrMessageLoaded - address-only-vm-service.ts' + ' ' + pageType);
    }    
    handleReset(){
        console.log('jump-ach-address-component-reset');
        this.reset();
    }
    init(){
        if(this.model.channel.channelData?.config?.displayAddressOverride=== false){
            this.displayAddressOverride = this.model.channel.channelData.config.displayAddressOverride;
        }
        this.viewModel = this.model.viewModel;
        this.viewModel.personalInfo = Object.assign({});
        this.viewModel.cardInfo = Object.assign({});
        this.viewModel.accountInfo = Object.assign({});
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
    }    
    setElementReference(){        
        const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputRefPair.push({key: 'address', value:'[name="jump-address"]'});
        inputRefPair.push({key: 'addressLine2', value:'[name="jump-line2"]'});
        inputRefPair.push({key: 'city', value:'[name="jump-city"]'});
        inputRefPair.push({key: 'state', value:'[name="jump-state"]'});
        inputRefPair.push({key: 'zipCode', value:'[name="jump-zip-code"]'});
        inputRefPair.push({key: 'addressOption', value:'[name="jump-address-option"]'});
        inputRefPair.push({key: 'existingAddressInfo', value:'[name="jump-existing-address-info"]'});
        inputRefPair.push({key: 'addressTemplate', value:'[name="jump-address-template"]'});
        this.formValidationService.setElementReference(inputRefPair);

    }
    submit(e:any){ 
        console.log('bind address-only-vm');
        this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
        if((this.model.channel.channelData.selectedPaymentType === 'cardonly' && this.addressFor.toLowerCase() === CC) || (this.model.channel.channelData.selectedPaymentType === 'achonly' && this.addressFor.toLowerCase()===ACH )){            
            const isFormValid = this.validate();

            const addressVm:IViewModel = Object.assign({});
            addressVm.personalInfo = Object.assign({});
            addressVm.personalInfo.addressInfo = Object.assign({});
            const addressInfo:IAddressModel = Object.assign({});
            addressInfo.address = this.inputReference?.address?.value;
            addressInfo.addressLine2 = this.inputReference?.addressLine2?.value; 
            addressInfo.city = this.inputReference?.city?.value;
            addressInfo.state = this.inputReference?.state?.value;
            addressInfo.zipCode = this.inputReference?.zipCode?.value;
            addressVm.personalInfo.addressInfo = addressInfo;
            //const isAddressChecked = this.inputReference.addressOption.checked;            
            if(isFormValid){
                this.view.addressActionDispatcher.fire(this,{detail: {action : JUMP_UPDATE_VIEW_MODEL, type:'address-' + this.addressFor,data:addressVm }});
                //this.view.addressActionDispatcher.fire(this,{detail: {action : 'jump-form-submit',data:addressVm }});
            } 
        }
               
    }
    edit(viewModel:IViewModel){
        //        
    }
    bindEvents(){
        //this.inputReference = this.formValidationService.inputReference;
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        this.setInputFieldErrMap();
        this.formValidationService.bindOnBlur();
        this.formValidationService.bindKeyup(['address','addressLine2','city','zipCode']);
        this.formValidationService.bindChange(['state']);                
        this.fillStates();
        //this.bindAddress();
        //this.setViewModel();     
        if(!this.model.channel.channelData.customerDetails.addressList) {
            this.bindWithExternalAddressCheckbox(); 
        } else {
            this.bindWithExternalAddress();
        } 
        if(!this.displayAddressOverride){
            this.displayAddress(true);
        }
        if(cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase() || cpcPageType === CARD_EXPIRATION_EDIT.toLowerCase()) {
            this.cardListSubmit();
        }     
    }
    
    setInputFieldErrMap(){
        const inputFieldErrPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
        inputFieldErrPair.push({key:'address', value:this.getErrorMessage(ErrorType.address_line_1, ErrorType.no_value)});
        inputFieldErrPair.push({key:'addressLine2', value:this.getErrorMessage(ErrorType.address_line_2, ErrorType.no_value)});
        inputFieldErrPair.push({key:'city', value:this.getErrorMessage(ErrorType.city, ErrorType.no_value)});
        inputFieldErrPair.push({key:'state', value:this.getErrorMessage(ErrorType.state, ErrorType.invalid)});
        inputFieldErrPair.push({key:'zipCode', value:this.getErrorMessage(ErrorType.zip, ErrorType.no_value)});        
        this.formValidationService.initFormErrorMap(inputFieldErrPair);
        if(this.model.channel?.channelData?.editForm?.address){
            this.formValidationService.setErrorMap('address', true);
        }
        if(this.model.channel?.channelData?.editForm?.addressLine2){
            this.formValidationService.setErrorMap('addressLine2', true);
        }
        if(this.model.channel?.channelData?.editForm?.city){
            this.formValidationService.setErrorMap('city', true);
        }
        if(this.model.channel?.channelData?.editForm?.state){
            this.formValidationService.setErrorMap('state', true);
        }
        if(this.model.channel?.channelData?.editForm?.zipCode){
            this.formValidationService.setErrorMap('zipCode', true);
        }
    }
    validate(): boolean {
        let flag = true;
        this.formFieldStatusMap.set('default', flag);
        console.log('inputref...', this.inputReference);
        this.removeErrorNodes(['address','addressLine2','state','city','zipCode']);
        this.formFieldStatusMap.set('default', flag);
        if (!this.displayAddressOverride || (this.inputReference.newAddressOption && this.inputReference.newAddressOption.checked === true)) {
            const addressValueChange = this.getAddressChangeValue();
            if(this.inputReference?.address?.value) {
                const isValid = this.validationService.validateAddress(
                    this.inputReference.address.value
                );
                if (!isValid.isValid) {
                    flag = false;
                    this.inputReference.address.classList.add('is-invalid');
                    this.inputReference.address?.parentElement.append(this.appendErrorFeedback( this.inputReference.address, this.getErrorMessage(ErrorType.address_line_1, ErrorType.invalid)));
                } else {
                    if (addressValueChange === true) {
                        this.model.channel.channelData.customerDetails.address =
                  this.inputReference.address.value;
                    }
                }
            } else {
                flag = false;
                this.inputReference.address.classList.add('is-invalid');
                this.inputReference.address?.parentElement.append(
                    this.appendErrorFeedback(
                        this.inputReference.address,
                        this.getErrorMessage(
                            ErrorType.address_line_1,
                            ErrorType.no_value
                        )
                    )
                );
            }
            this.formFieldStatusMap.set('address', flag);
            if (
                this.inputReference?.addressLine2?.value 
                || this.inputReference?.addressLine2?.value.length === 0
            ) {
                const isValid = this.validationService.validateAddressLine2(
                    this.inputReference.addressLine2.value
                );
                if (!isValid) {
                    flag = false;
                    this.inputReference.addressLine2.classList.add('is-invalid');
                    this.inputReference.addressLine2?.parentElement.append(
                        this.appendErrorFeedback(this.inputReference.addressLine2,this.getErrorMessage(
                            ErrorType.address_line_1,
                            ErrorType.invalid
                        )
                        )
                    );
                } else {
                    if (addressValueChange === true) {
                        this.model.channel.channelData.customerDetails.addressLine2 =
                  this.inputReference.addressLine2.value;
                    }
                }
            } else {
                flag = false;
                this.inputReference.addressLine2.classList.add('is-invalid');
                this.inputReference.addressLine2?.parentElement.append(
                    this.appendErrorFeedback(this.inputReference.addressLine2, this.getErrorMessage(ErrorType.address_line_1,ErrorType.no_value))
                );
                console.log(this.getErrorMessage(ErrorType.address_line_2, ErrorType.no_value)
                );
            }
            this.formFieldStatusMap.set('addressLine2', flag);
            if (this.inputReference?.city?.value) {
                const isValid = this.validationService.validateCity(
                    this.inputReference.city.value
                );
                if (!isValid.isValid) {
                    flag = false;
                    this.inputReference.city.classList.add('is-invalid');
                    this.inputReference.city?.parentElement.append(this.appendErrorFeedback(this.inputReference.city,this.getErrorMessage(ErrorType.city, ErrorType.invalid)));
                } else {
                    if (addressValueChange === true) {
                        this.model.channel.channelData.customerDetails.city =
                  this.inputReference.city.value;
                    }
                }
            } else {
                flag = false;
                this.inputReference.city.classList.add('is-invalid');
                this.inputReference.city?.parentElement.append(
                    this.appendErrorFeedback(
                        this.inputReference.city,
                        this.getErrorMessage(ErrorType.city, ErrorType.no_value)
                    )
                );
                console.log(this.getErrorMessage(ErrorType.city, ErrorType.no_value)
                );
            }
            this.formFieldStatusMap.set('city', flag);
            if (this.inputReference?.state?.value) {
                const isValid = this.validationService.validateState(
                    this.inputReference.state.value
                );
                if (!isValid) {
                    flag = false;
                    this.inputReference.state.classList.add('is-invalid');
                    this.inputReference.state?.parentElement.append(
                        this.appendErrorFeedback(this.inputReference.state,this.getErrorMessage(ErrorType.state, ErrorType.invalid)
                        )
                    );
                } else {
                    if (addressValueChange === true) {
                        this.model.channel.channelData.customerDetails.state =
                  this.inputReference.state.value;
                    }
                }
            } else {
                flag = false;
                this.inputReference.state.classList.add('is-invalid');
                this.inputReference.state?.parentElement.append(this.appendErrorFeedback(this.inputReference.state,this.getErrorMessage(ErrorType.state, ErrorType.no_value)));
                console.log(this.getErrorMessage(ErrorType.state, ErrorType.no_value));
            }
            this.formFieldStatusMap.set('state', flag);
            if (this.inputReference?.zipCode?.value) {
                const isValid = this.validationService.validateZipcode(
                    this.inputReference.zipCode.value
                );
                if (!isValid.isValid) {
                    flag = false;
                    this.inputReference.zipCode.classList.add('is-invalid');
                    this.inputReference.zipCode?.parentElement.append(
                        this.appendErrorFeedback(this.inputReference.zipCode,this.getErrorMessage(ErrorType.zip, ErrorType.invalid)
                        )
                    );
                } else {
                    if (addressValueChange === true) {
                        this.model.channel.channelData.customerDetails.zip =
                  this.inputReference.zipCode.value;
                    }
                }
            } else {
                flag = false;
                this.inputReference.zipCode.classList.add('is-invalid');
                this.inputReference.zipCode?.parentElement.append(
                    this.appendErrorFeedback(
                        this.inputReference.zipCode,
                        this.getErrorMessage(ErrorType.zip, ErrorType.no_value)
                    )
                );
                console.log(this.getErrorMessage(ErrorType.zip, ErrorType.no_value)
                );
            }
            this.formFieldStatusMap.set('zipCode', flag);
        } else {
            if(this.model.channel.channelData.customerDetails.addressList) {
                this.setCurrentAddress();
            }
            this.formFieldStatusMap = new Map<string, boolean>();
        }
        flag = this.formValidationService.isFormValid(this.formFieldStatusMap);
        if(flag === false) {
            const element:any = document.getElementsByClassName('invalid-feedback');
            element[0]?.parentElement?.scrollIntoView();
        }
        return flag;
    }   
    fillStates=(): void => {
        let options = '<option id="stateSelect" value="" disabled selected>Select</option>';
        for (let i = 0; i < STATES.length; i++) {
            options = options + `<option value="${STATES[i]}">${STATES[i]}</option>`;
        }
        this.inputReference.state.innerHTML = options;
        let stateSelect;
        // = document.getElementById('jump-state') as HTMLSelectElement;
        const cardComponent =  document.getElementById('jump-cc-web-component');
        const bankComponent =  document.getElementById('jump-ach-web-component');
        if(cardComponent?.classList.contains('show')) {
            stateSelect = document.querySelector('#jump-cc-web-component [name="jump-state"]') as HTMLInputElement;
        }
        if(bankComponent?.classList.contains('show')) {
            stateSelect = document.querySelector('#jump-ach-web-component [name="jump-state"]') as HTMLInputElement;
        }
        const fillState = stateSelect?.getAttribute('fillState');
        if (stateSelect && fillState) {
            stateSelect.value  = fillState;
        }
    };    
    getAddressChangeValue():boolean {
        let addressValueChanged = true;
        if(this.model.channel?.channelData.customerDetails.address !== this.inputReference.address){
            addressValueChanged = false;
        } else if(this.model.channel?.channelData.customerDetails.addressLine2 !== this.inputReference.addressLine2){
            addressValueChanged = false;
        } else if(this.model.channel?.channelData.customerDetails.city !== this.inputReference.city){
            addressValueChanged = false;
        } else if(this.model.channel?.channelData.customerDetails.state !== this.inputReference.state){
            addressValueChanged = false;
        } else if(this.model.channel?.channelData.customerDetails.zip !== this.inputReference.zipCode){
            addressValueChanged = false;
        }
        return addressValueChanged;
    }  
    getErrorMessage(key:string, subKey?:string): string { 
        const currentTemplate = this.global.appState.get('currentPaymentSubType');
        let validationType:ErrorType = ErrorType.card;
        if(currentTemplate){
            if(currentTemplate.toLowerCase() === PaymentType.CardOnly.toString().toLowerCase()){
                validationType = ErrorType.card;
            } else if(currentTemplate.toLowerCase() === PaymentType.AchOnly.toString().toLowerCase()){
                validationType = ErrorType.bank;
            }
        }        
        let errorMessage = '';
        switch(key){
        default:
            errorMessage = this.global.getErrorMessage(ErrorType.form,validationType, key,subKey);
            break;
        }
        return errorMessage;
    } 
    getAddressValues(channelData:any):AddressDetails {
        const addressDeatils = {
            addressLabel:'',
            defaultAddress:false,
            address:channelData.address,
            addressLine2:channelData.addressLine2,
            city : channelData.city,
            state: channelData.state,
            zip: channelData.zip,
        };
        return addressDeatils;
    }
    bindWithExternalAddress(){
        if(this.inputReference?.newAddressOption?.checked ){
            this.displayAddress(true);
            //this.inputReference.existingAddressInfo.innerHTML = '';
  
            this.model.channel.channelData.customerDetails.address = '';
            this.model.channel.channelData.customerDetails.addressLine2 = '';
            this.model.channel.channelData.customerDetails.city = '';
            this.model.channel.channelData.customerDetails.state = '';
            this.model.channel.channelData.customerDetails.zip = '';
  
            this.inputReference.address.value = '';
            this.inputReference.addressLine2.value = '';
            this.inputReference.city.value = '';
            this.inputReference.state.value = '';
            this.inputReference.zipCode.value = '';
        } else {
            
            this.displayAddress(false);        
            
        }
    }  
    removeErrorNodes(arrInputRef:Array<string>){
        arrInputRef.forEach(item=>{
            this.removeErrorFeedback(this.inputReference[item as keyof IInputReference]);
        });     
    }
    launchEditMode(){        
        this.inputReference.address.value = this.model.channel.channelData.editForm.address ? this.model.channel.channelData.editForm.address : '';
        this.inputReference.addressLine2.value = this.model.channel.channelData.editForm.addressLine2 ? this.model.channel.channelData.editForm?.addressLine2 : '';
        this.inputReference.city.value = this.model.channel.channelData.editForm.city ? this.model.channel.channelData.editForm?.city : '';
        this.inputReference.state.value = this.model.channel.channelData.editForm.state ? this.model.channel.channelData.editForm.state : '';
        this.inputReference.zipCode.value = this.model.channel.channelData.editForm.zipCode ? this.model.channel.channelData.editForm.zipCode : '';                
    }
    reset(){
        if(this.inputReference.newAddressOption){
            this.inputReference.newAddressOption.checked = false;
        }
        this.model.channel.channelData.customerDetails.address = this.inputReference.address.value = '';
        this.inputReference.address.classList.remove('is-invalid');
        this.removeErrorFeedback('address');

        this.model.channel.channelData.customerDetails.addressLine2 = this.inputReference.addressLine2.value = '';        
        this.inputReference.addressLine2.classList.remove('is-invalid');
        this.removeErrorFeedback('addressLine2');

        this.model.channel.channelData.customerDetails.city = this.inputReference.city.value = '';
        this.inputReference.city.classList.remove('is-invalid');
        this.removeErrorFeedback('city');

        this.model.channel.channelData.customerDetails.state = this.inputReference.state.value = '';        
        this.inputReference.state.classList.remove('is-invalid');
        this.removeErrorFeedback('state');

        this.model.channel.channelData.customerDetails.zip = this.inputReference.zipCode.value = '';  
        this.inputReference.zipCode.classList.remove('is-invalid');
        this.removeErrorFeedback('zipCode');
        
        if(this.model.channel.channelData.customerDetails.addressList) {
            this.bindWithExternalAddress();
        } else {
            this.bindWithExternalAddressCheckbox();
        }
        if(this.model.channel?.channelData?.editForm) {
            this.launchEditMode();
        }
        if(this.model.channel.channelData.customerDetails.addressList) {
            this.setDefaultAddress();
        }
        if(!this.displayAddressOverride){
            this.clearAddress();
            this.displayAddress(true);
        }
    }  
    bindOptionTemplateToView(componentId:string){
        console.log('componentId: ', componentId);
        if(!this.displayAddressOverride){
            document.querySelector('jump-address-option-component')?.remove();            
        } else{
            console.log('address for:::', this.addressFor);
            const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
            if(this.addressFor.toLowerCase()===CC){
                inputRefPair.push({key: 'primaryAddressOption', value:'#primaryAddressOptionCc [name="jump-address-option"]'});
                inputRefPair.push({key: 'secondaryAddressOption', value:'#secondaryAddressOptionCc [name="jump-address-option"]'});
                inputRefPair.push({key: 'newAddressOption', value:'#newAddressOptionCc [name="jump-address-option"]'});
                inputRefPair.push({key: 'existingAddressInfo', value:'#newAddressOptionCc [name="jump-existing-address-info"]'});
                inputRefPair.push({key:'displayAddressOption', value:'#primaryAddressOptionCc [name="jump-display-address-option"]'});
            }else if(this.addressFor.toLowerCase() === ACH){
                inputRefPair.push({key: 'primaryAddressOption', value:'#primaryAddressOptionAch [name="jump-address-option"]'});
                inputRefPair.push({key: 'secondaryAddressOption', value:'#secondaryAddressOptionAch [name="jump-address-option"]'});
                inputRefPair.push({key: 'newAddressOption', value:'#newAddressOptionAch [name="jump-address-option"]'});
                inputRefPair.push({key: 'existingAddressInfo', value:'#newAddressOptionAch [name="jump-existing-address-info"]'});
                inputRefPair.push({key:'displayAddressOption', value:'#primaryAddressOptionAch [name="jump-display-address-option"]'});
            }
            this.formValidationService.setElementReference(inputRefPair);
        }
        
        
        

        // if(this.inputReference.newAddressOption){
        //     this.inputReference.newAddressOption.checked = false;
        // }
        

        
        if(this.inputReference.primaryAddressOption){
            if(!this.isPrimaryAddressBind){                
                this.bindPrimaryAddress();
                this.isPrimaryAddressBind = true;
            }
            
        }
        if(this.inputReference.secondaryAddressOption){
            if(!this.isSecondaryAddressBind){
                this.bindSecondaryAddress();
                this.isSecondaryAddressBind = true;
            }            
        }
        if(this.inputReference.newAddressOption){
            if(!this.isNewAddressBind){
                //this.setDefaultAddress();  
                //this.setCurrentAddress();
                this.bindNewAddress();
                this.bindWithExternalAddress();
                          
                this.isNewAddressBind =true;
            }            
        }
        if(this.inputReference.primaryAddressOption 
            && this.inputReference.secondaryAddressOption 
            && this.inputReference.newAddressOption){
            this.setDefaultAddress();  
            this.setCurrentAddress();
        }
        if(this.model.channel.channelData.customerDetails.addressList.length <= 1) {
            this.setDefaultAddress();  
        }        

    } 
    bindOptionCheckboxTemplateToView(){
        if(!this.displayAddressOverride){
            document.querySelector('jump-address-option-component')?.remove();            
        } else{
            console.log('address for:::', this.addressFor);
            const inputRefPair:Array<IKeyValuePair> = new Array<IKeyValuePair>();
            if(this.addressFor.toLowerCase()===CC){
                inputRefPair.push({key: 'newAddressOption', value:'#newAddressOptionCc [name="jump-address-option"]'});
                inputRefPair.push({key: 'existingAddressInfo', value:'#newAddressOptionCc [name="jump-existing-address-info"]'});
                inputRefPair.push({key:'displayAddressOption', value:'#newAddressOptionCc [name="jump-display-address-option"]'});
            }else if(this.addressFor.toLowerCase() === ACH){
                inputRefPair.push({key: 'newAddressOption', value:'#newAddressOptionAch [name="jump-address-option"]'});
                inputRefPair.push({key: 'existingAddressInfo', value:'#newAddressOptionAch [name="jump-existing-address-info"]'});
                inputRefPair.push({key:'displayAddressOption', value:'#newAddressOptionAch [name="jump-display-address-option"]'});
            }
            this.formValidationService.setElementReference(inputRefPair);
        }
        
        
        if(!this.displayAddressOverride){
            this.displayAddress(true);
        }
        if(this.inputReference.newAddressOption){
            this.inputReference.newAddressOption.checked = false;
        }

        if(this.inputReference.newAddressOption){
            this.bindAddressCheckbox();
            this.bindWithExternalAddressCheckbox();
        }
    } 
    bindNewAddress(){                
        this.inputReference.newAddressOption.addEventListener('click', (e:any) => {            
            console.log('bind new address...');
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
            this.displayAddress(true);
            this.inputReference.existingAddressInfo.innerHTML = '';
            this.model.channel.channelData.customerDetails.address = '';
            this.model.channel.channelData.customerDetails.addressLine2 = '';
            this.model.channel.channelData.customerDetails.city = '';
            this.model.channel.channelData.customerDetails.state = '';
            this.model.channel.channelData.customerDetails.zip = '';

            this.inputReference.address.value = '';
            this.inputReference.addressLine2.value = '';
            this.inputReference.city.value = '';
            this.inputReference.state.value = '';
            this.inputReference.zipCode.value = '';

            if(this.model.channel?.channelData?.editForm){
                this.launchEditMode();
            }
            if(this.formValidationService.paymentType === PaymentType.CardOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_CREDIT_CARD_ADDRESS_SELECT, e.target?.checked);
            } else if(this.formValidationService.paymentType === PaymentType.AchOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_ADDRESS_SELECT, e.target?.checked);
            }
        });        
    }
    bindPrimaryAddress(){             
        this.inputReference.primaryAddressOption?.addEventListener('click', (e:any) => {
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false);         
            this.bindWithExternalAddress();
            this.setCurrentAddress();
            if(this.formValidationService.paymentType === PaymentType.CardOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_PRIMARY_ADDRESS_OPTION_SELECT, false);
            } else if(this.formValidationService.paymentType === PaymentType.AchOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_PRIMARY_ADDRESS_OPTION_SELECT, false);
            }
        });            
    }
    bindSecondaryAddress(){          
        this.inputReference.secondaryAddressOption?.addEventListener('click', (e:any) => {           
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false); 
            this.bindWithExternalAddress();
            this.setCurrentAddress();
            if(this.formValidationService.paymentType === PaymentType.CardOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_SECONDARY_ADDRESS_OPTION_SELECT, false);
            } else if(this.formValidationService.paymentType === PaymentType.AchOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_SECONDARY_ADDRESS_OPTION_SELECT, false);
            }
        });           
    } 
    displayAddress(display:boolean){
        if(display) {
            this.inputReference.addressTemplate.classList.remove('d-none');
            this.inputReference.addressTemplate.classList.add('show');
        } else {
            this.inputReference.addressTemplate.classList.add('d-none');
            this.inputReference.addressTemplate.classList.remove('show');
        }
    }
    bindAddressCheckbox(){ 
        this.inputReference.newAddressOption.addEventListener('click', (e:any) => {
            this.global.updateVmMap.set(ADDRESS_COMPONENT,false);
            if(!e.target?.checked) {
                this.displayAddress(false);
                this.bindWithExternalAddressCheckbox();
            } else {
                this.displayAddress(true);
                this.inputReference.existingAddressInfo.innerHTML = '';
                this.clearAddress();
                if(this.model.channel?.channelData?.editForm){
                    this.launchEditMode();
                }
            }
            if(this.formValidationService.paymentType === PaymentType.CardOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_CREDIT_CARD_ADDRESS_SELECT, e.target?.checked);
            } else if(this.formValidationService.paymentType === PaymentType.AchOnly){
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_ADDRESS_SELECT, e.target?.checked);
            }
        });
    }
    bindWithExternalAddressCheckbox(){
        if(!this.displayAddressOverride) return;
        
        if(this.inputReference?.newAddressOption?.checked ){
            this.displayAddress(true);
            this.inputReference.existingAddressInfo.innerHTML = '';
            this.clearAddress();
        } else {
            this.displayAddress(false);
            if(this.model.channel.channelData?.customerDetails) {
                //this.inputReference.existingAddressInfo.innerHTML = '';
                this.getFormattedAddress();
                this.model.channel.channelData.customerDetails.address = this.addressDetail.address;        
                this.model.channel.channelData.customerDetails.addressLine2 = this.addressDetail.addressLine2;
                this.model.channel.channelData.customerDetails.city = this.addressDetail.city;        
                this.model.channel.channelData.customerDetails.state = this.addressDetail.state;        
                this.model.channel.channelData.customerDetails.zip = this.addressDetail.zip;
                    
                this.inputReference.address.value = this.addressDetail.address;
                this.inputReference.addressLine2.value = this.addressDetail.addressLine2;
                this.inputReference.city.value = this.addressDetail.city;
                this.inputReference.state.value = this.addressDetail.state;
                this.inputReference.zipCode.value = this.addressDetail.zip;
            }
        }
    }
    getFormattedAddress():void {
        const cpcPageType = this.global.appState.get('config').cpcPageType.toLowerCase();
        if(this.model.channel.channelData?.customerDetails.displayAddress){
            if(this.inputReference.existingAddressInfo && !this.addressDetail.addressLine2 && this.addressDetail.addressLine2 !== 'undefined') {
                this.inputReference.existingAddressInfo.innerHTML =  `${this.addressDetail.address}, ${this.addressDetail.city} ${this.addressDetail.state}, ${this.addressDetail.zip}`;
            } else if(this.inputReference.existingAddressInfo && cpcPageType !== CARD_EXPIRATION_EDIT.toLowerCase()){
                this.inputReference.existingAddressInfo.innerHTML =  `${this.addressDetail.address}, ${this.addressDetail.addressLine2}, ${this.addressDetail.city} ${this.addressDetail.state}, ${this.addressDetail.zip}`;
            }                  
        }
    }
    clearAddress() {
        this.model.channel.channelData.customerDetails.address = '';
        this.model.channel.channelData.customerDetails.addressLine2 = '';
        this.model.channel.channelData.customerDetails.city = '';
        this.model.channel.channelData.customerDetails.state = '';
        this.model.channel.channelData.customerDetails.zip = '';

        this.inputReference.address.value = '';
        this.inputReference.addressLine2.value = '';
        this.inputReference.city.value = '';
        this.inputReference.state.value = '';
        this.inputReference.zipCode.value = '';
    }
    setCurrentAddress(){
        let addressDetail:AddressDetails = Object.assign({});
        if(this.inputReference.primaryAddressOption?.checked){
            addressDetail = this.model.channel.channelData.customerDetails.addressList[0];
        } else if(this.inputReference.secondaryAddressOption?.checked){
            addressDetail = this.model.channel.channelData.customerDetails.addressList[1];
        } 
        if(addressDetail){
            this.model.channel.channelData.customerDetails.address = addressDetail.address;        
            this.model.channel.channelData.customerDetails.addressLine2 = addressDetail.addressLine2;
            this.model.channel.channelData.customerDetails.city = addressDetail.city;        
            this.model.channel.channelData.customerDetails.state = addressDetail.state;        
            this.model.channel.channelData.customerDetails.zip = addressDetail.zip;
            
            this.inputReference.address.value = addressDetail.address;
            this.inputReference.addressLine2.value = addressDetail.addressLine2;
            this.inputReference.city.value = addressDetail.city;
            this.inputReference.state.value = addressDetail.state;
            this.inputReference.zipCode.value = addressDetail.zip;
        }  
        if(!addressDetail.address) {
            this.inputReference.address.value = '';
            this.inputReference.addressLine2.value = '';
            this.inputReference.city.value = '';
            this.inputReference.state.value = '';
            this.inputReference.zipCode.value = '';
        }    
    } 
    setDefaultAddress(){
        if(!this.displayAddressOverride) return;
        let hasDefault = false;                
        if(!this.model.channel.channelData.customerDetails.addressList || this.model.channel.channelData.customerDetails.addressList.length<1 ){
            this.inputReference.newAddressOption.checked = true;
        } else if(this.model.channel.channelData.customerDetails?.addressList) {
            const isDefaultPrimaryAddress = this.model.channel.channelData.customerDetails?.addressList[0]?.defaultAddress;
            const isDefaultSecondaryAddress = this.model.channel.channelData.customerDetails?.addressList[1]?.defaultAddress;
            if(isDefaultPrimaryAddress){
                this.inputReference.primaryAddressOption.checked = true;
            } else if(isDefaultSecondaryAddress){
                this.inputReference.secondaryAddressOption.checked = true;
            }else {
                this.inputReference.newAddressOption.checked = true;
            }
        }else {
            this.inputReference.newAddressOption.checked = true;
        }
        //check if no defualt is set, then set 'New Address' as default
        if(this.model.channel.channelData.customerDetails.addressList && this.model.channel.channelData.customerDetails.addressList.length>0){
            for(let i=0;i<this.model.channel.channelData.customerDetails.addressList.length;i++){
                if(this.model.channel.channelData.customerDetails.addressList[i].defaultAddress){
                    hasDefault = true;
                    break;
                }
            }
            if(!hasDefault){
                this.inputReference.newAddressOption.checked = true;
                this.displayAddress(true);
            }else{
                this.displayAddress(false);
            }
        }
         
    }
    cardListSubmit():void {
        const reviewButtonCC = document.querySelector('#' + 'cardListPlaceholderCard' + ' [id="jump-save-option-cc"]');
        const reviewButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-save-option-ach"]');
        reviewButtonCC?.addEventListener('click', () => {
            this.submit('');
        });
        reviewButtonAch?.addEventListener('click', () => {
            this.submit('');
        });
        const cancelButtonCC = document.querySelector('#' + 'cardListPlaceholderCard' + ' [id="jump-cancel-option-cc"]');
        const cancelButtonAch = document.querySelector('#' + 'cardListPlaceholderBank' + ' [id="jump-cancel-option-ach"]');

        cancelButtonCC?.addEventListener('click', () => {
            this.clearAddress();
        });
        cancelButtonAch?.addEventListener('click', () => {
            this.clearAddress();
        });
    }
}