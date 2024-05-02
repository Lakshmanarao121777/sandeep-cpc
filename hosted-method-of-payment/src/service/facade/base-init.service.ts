import { FetchData } from '../../api/fetch-data';
import { JUMP_ACH_ADDRESS_COMPONENT_LOADED, JUMP_CC_ADDRESS_COMPONENT_LOADED, JUMP_HOSTED_CONTAINER, JUMP_ACH_TC_COMPONENT_LOADED, JUMP_CC_TC_COMPONENT_LOADED, JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_LOADED, JUMP_CC_DEFAULT_PAYMENT_COMPONENT_LOADED, JUMP_CC_CARE_COMPONENT_LOADED, JUMP_ACH_CARE_COMPONENT_LOADED, CC, ACH, EVN_CPC_ERROR, JUMP_CC_USERROLE_LIST_COMPONENT_LOADED, JUMP_ACH_USERROLE_LIST_COMPONENT_LOADED } from '../../constant/app.constant';
import {IChannelTemplateMaping, IConfig, MessageType, PaymentType } from '../../model/view.model';
import {IChannelData, UserRoleDetails } from '../../model/channel-data';

import { ActionObserverService } from '../action-observer-service';
import { CardOnlyService } from '../card-only.service';
import { ChannelService } from '../channel-service';
import { CardOnlyViewModelService } from '../viewModel/card-only-vm-service';
import { HostedComponent } from '../../component/hosted.component';
import { Globals } from '../../utils/globals';
import { Validation } from '../../utils/validation';
import { FormValidationService } from '../form-validation-service';
import { AddressOnlyService } from '../address-only.service';
import { AddressOnlyViewModelService } from '../viewModel/address-only-vm-service';
import { CommonService } from '../common.service';
import { AchOnlyViewModelService } from '../viewModel/ach-only-vm-service';
import { AchOnlyService } from '../ach-only.service';
import { DataLayerService } from '../data-layer.service';
import { AccountTypeViewModelService } from '../viewModel/account-type-vm.service';
import { AccountTypeService } from '../account-type.service';
import { UserroleListViewModelService } from '../viewModel/userrole-list-vm.service';
import { UserroleListService } from '../userrole-list.service';

import { ErrorHandling } from '../../utils/error-handling';
import { MinCardOnlyService } from '../min-card-only.service';
import { MinCardOnlyViewModelService } from '../viewModel/min-card-only-vm-service';
import { MinCardEditService } from '../min-card-edit.service';
import { MinAchOnlyService } from '../min-ach-only.service';
import { MinAchOnlyViewModelService } from '../viewModel/min-ach-only-vm-service';
import { CardOnlyEditService } from '../card-only-edit.service';
import { AchOnlyEditService } from '../ach-only-edit.service';
import { CardListViewModelService } from '../viewModel/card-list-vm.service';
import { CardListService } from '../card-list.service';
import { CardOrBankViewModelService } from '../viewModel/card-or-bank-vm.service';
import { AutoPayService } from '../auto-pay.service';
import { AutoPayViewModelService } from '../viewModel/auto-pay-vm-service';
import { TermsAndConditionViewModelService } from '../viewModel/terms-and-condition-vm-service';
import { TermsAndConditionService } from '../terms-and-condition.service';
import { DefaultPaymentService } from '../default-payment.service';
import { DefaultPaymentViewModelService } from '../viewModel/default-payment-vm-service';
import { WalletMgmtNoAutopayService } from '../wallet-mgmt-no-autopay.service';
import { CareService } from '../care.service';
import { CareViewModelService } from '../viewModel/care-vm.service';
import { createAddressOptionDynamically, createAddressOptionForNewComponent } from '../util/address';

export class BaseInitService {
    public actionObserverService:ActionObserverService = Globals.getInstance().actionObserverService;  //new  ActionObserverService();
    public commonService:CommonService;
    public channel:ChannelService;
    public config:IConfig;
    public channelData:IChannelData;
    public ccComponent: any;
    public cardListComponent: any;
    public achComponent: any;
    public accTypeComponent: any;
    public userroleListComponentCc: any;
    public userroleListComponentAch: any;
    public addressComponentCc: any;
    public addressComponentAch: any;
    public careComponentCc: any;
    public careComponentAch: any;
    public defaultPaymentComponentCc: any;
    public defaultPaymentComponentAch: any;
    public cardOnlyService:CardOnlyService = Object.assign({});
    public cardListService:CardListService = Object.assign({});
    public cardOnlyEditService:CardOnlyEditService = Object.assign({});
    public careServiceCC:CareService = Object.assign({});
    public careServiceACH:CareService = Object.assign({});
    public achOnlyEditService:AchOnlyEditService = Object.assign({});
    public achOnlyService:AchOnlyService = Object.assign({});
    public minAchOnlyService:MinAchOnlyService = Object.assign({});    
    public minCardOnlyService:MinCardOnlyService = Object.assign({});
    public minCardEditService:MinCardEditService = Object.assign({});
    public accTypeService:AccountTypeService = Object.assign({});
    public userroleListServiceCc:UserroleListService = Object.assign({});
    public userroleListServiceAch:UserroleListService = Object.assign({});
    public addressOnlyService:AddressOnlyService = Object.assign({});
    public defaultPaymentService:DefaultPaymentService = Object.assign({});
    public errorMessageResponse:any;
    public global:Globals;
    public validationService:Validation;
    public formValidationServiceCc:FormValidationService;
    public formValidationServiceCcList:FormValidationService;
    public formValidationServiceAch:FormValidationService;
    public hc: HostedComponent = Object.assign({});
    public fetchTemplate = Object.assign({});
    public addressOnlyViewModelService:AddressOnlyViewModelService = Object.assign({});
    public mappedChannelTemplate:Array<IChannelTemplateMaping> = Object.assign([]);
    public paymentTypeCardOnly = PaymentType[PaymentType.CardOnly].toLowerCase();
    public paymentTypeAchOnly = PaymentType[PaymentType.AchOnly].toLowerCase();
    public paymentTypeCardOrBank = PaymentType[PaymentType.CardOrBank].toLowerCase();
    public paymentTypeBankOrCard = PaymentType[PaymentType.BankOrCard].toLowerCase();
    public paymentTypeCardOnlyWithEdit = PaymentType[PaymentType.CardOnlyWithEdit].toLowerCase();
    public currentPaymentType = '';
    public currentAccountType = '';
    public templateContent = Object.assign({});
    public dataLayerService:DataLayerService = Object.assign({});
    public cardOnlyViewModelService:CardOnlyViewModelService = Object.assign({});
    public cardOrBankViewModelService:CardOrBankViewModelService = Object.assign({});    
    public cardListViewModelService:CardListViewModelService = Object.assign({});
    public minCardOnlyViewModelService:MinCardOnlyViewModelService = Object.assign({});
    public achOnlyViewModelService:AchOnlyViewModelService = Object.assign({});
    public minAchOnlyViewModelService:MinAchOnlyViewModelService = Object.assign({});
    public accountTypeViewModelService:AccountTypeViewModelService = Object.assign({});
    public userroleListViewModelServiceCc:UserroleListViewModelService = Object.assign({});
    public userroleListViewModelServiceAch:UserroleListViewModelService = Object.assign({});
    public defaultPaymentViewModelServiceCc:DefaultPaymentViewModelService = Object.assign({});
    public defaultPaymentViewModelServiceAch:DefaultPaymentViewModelService = Object.assign({});
    public careViewModelServiceCc:CareViewModelService = Object.assign({});
    public careViewModelServiceAch:CareViewModelService = Object.assign({});
    public errorHandling:ErrorHandling = Object.assign({});
    public autoPayViewModelService:AutoPayViewModelService = Object.assign({});
    public autoPayViewModelServiceCc:AutoPayViewModelService = Object.assign({});
    public autoPayViewModelServiceAch:AutoPayViewModelService = Object.assign({});
    public tcViewModelServiceCc:TermsAndConditionViewModelService = Object.assign({});
    public tcViewModelServiceAch:TermsAndConditionViewModelService = Object.assign({});
    public autoPayService:AutoPayService = Object.assign({});
    public termsAndConditionServiceCC:TermsAndConditionService = Object.assign({});
    public termsAndConditionServiceAch:TermsAndConditionService = Object.assign({});
    public autoPayServiceCc:AutoPayService = Object.assign({});
    public autoPayServiceAch:AutoPayService = Object.assign({});
    public autoPayComponentCc: any;
    public autoPayComponentAch: any;
    public termsComponentCc: any;
    public termsComponentAch: any;
    public defaultPaymentCc: any;
    public defaultPaymentAch: any;
    public careCc: any;
    public careAch: any;
    public walletMgmtNoAutopayService: WalletMgmtNoAutopayService = Object.assign({});

    constructor(config:IConfig, channelData:IChannelData){
        this.config = config;
        this.channelData = channelData;
        this.global = Globals.getInstance();        
        this.channel = new ChannelService(channelData);
        this.appendChannelName();
        this.global.appState.set('config', this.config);
        this.global.appState.set('channelData', this.channel.channelData);

        this.commonService = new CommonService(this.actionObserverService,this.channel,config);
        this.hc = new HostedComponent(this.config, this.channelData,this.channel, this.actionObserverService,this.commonService);
        this.formValidationServiceCc = new FormValidationService();
        this.formValidationServiceCcList = new FormValidationService();
        this.formValidationServiceAch = new FormValidationService();
        this.validationService = new Validation();
        this.fetchTemplate = new FetchData();
        this.dataLayerService = new DataLayerService();
        this.errorHandling = new ErrorHandling(this.channel);
        this.setDefaultAddress();
        this.subscribe();

    }
    
    setDefaultAddress(){
        const customerDetail = this.channel.channelData.customerDetails;
        let hasDefaultAddress = false; 
        if(customerDetail && customerDetail.addressList && customerDetail.addressList.length>0){
            const addressList = customerDetail.addressList;
            for(let i=0;i<addressList.length;i++){        
                if(i>=2){
                    break;
                }                
                if(addressList[i].defaultAddress){
                    hasDefaultAddress = true;
                    this.channel.channelData.customerDetails.addressLabel = addressList[i].addressLabel;
                    this.channel.channelData.customerDetails.defaultAddress = addressList[i].defaultAddress;
                    this.channel.channelData.customerDetails.address = addressList[i].address;
                    this.channel.channelData.customerDetails.addressLine2 = addressList[i].addressLine2;
                    this.channel.channelData.customerDetails.city = addressList[i].city;
                    this.channel.channelData.customerDetails.state = addressList[i].state;
                    this.channel.channelData.customerDetails.zip = addressList[i].zip;
                }                
            }
            //if defaultAddress not provided, set first provded address as default
            if(!hasDefaultAddress){
                this.setDefaultAddressValues();
            }
        }else if(this.channel.channelData.customerDetails.address) {
            console.log(this.channel.channelData.customerDetails.address);
        } else {
            this.setDefaultAddressValues();
        }        
    }  
    setDefaultAddressValues():void {
        this.channel.channelData.customerDetails.addressLabel ='New address';
        this.channel.channelData.customerDetails.defaultAddress = true;
        this.channel.channelData.customerDetails.address = '';
        this.channel.channelData.customerDetails.addressLine2 = '';
        this.channel.channelData.customerDetails.city = '';
        this.channel.channelData.customerDetails.state = '';
        this.channel.channelData.customerDetails.zip = '';
    }  
    appendChannelName(){
        const channelName = this.channelData.channelDetails.channelName;
        const paymentServiceUrl = this.config.envConfig.methodOfPaymentServiceUrl;
        paymentServiceUrl.addToWallet = paymentServiceUrl.addToWallet + '/' + channelName ;
        paymentServiceUrl.getPublicKey = paymentServiceUrl.getPublicKey + '/' + channelName ;
        paymentServiceUrl.getPaymentConfiguration = paymentServiceUrl.getPaymentConfiguration + '/' + channelName;
        paymentServiceUrl.getExistingPaymentInstrument = paymentServiceUrl.getExistingPaymentInstrument + '/' + channelName;
        paymentServiceUrl.updateExistingPaymentInstrument = paymentServiceUrl.updateExistingPaymentInstrument + '/' + channelName ;        
        paymentServiceUrl.getAllPaymentInstruments = paymentServiceUrl.getAllPaymentInstruments + '/' + channelName ;
        paymentServiceUrl.enrollInAutopay = paymentServiceUrl.enrollInAutopay + '/' + channelName ;
    }
    subscribe(){
        this.hc.loadIguardScript();
        this.hc.cyberSourceConfiguration();
        this.actionObserverService.subscribe((sender:any,data:any)=>{
            switch(data.detail.action){
            //IMP:ONLY FOR SUB-COMPONENTS            
            case JUMP_CC_ADDRESS_COMPONENT_LOADED:
                this.addressComponentCc = document.getElementById('jump-cc-address');  
                this.addressOnlyViewModelService = new AddressOnlyViewModelService(this.addressComponentCc,this.addressOnlyService,this.formValidationServiceCc,this.validationService);                
                this.appendAddressOptionComponent('[id="jump-cc-address"]','primaryAddressOptionCc','secondaryAddressOptionCc', 'newAddressOptionCc');
                this.addressOnlyViewModelService.executeBindEvent(JUMP_CC_ADDRESS_COMPONENT_LOADED);
                break;
            case JUMP_ACH_ADDRESS_COMPONENT_LOADED:
                this.addressComponentAch = document.getElementById('jump-ach-address');  
                this.addressOnlyViewModelService = new AddressOnlyViewModelService(this.addressComponentAch,this.addressOnlyService,this.formValidationServiceAch,this.validationService);                
                this.appendAddressOptionComponent('[id="jump-ach-address"]','primaryAddressOptionAch','secondaryAddressOptionAch', 'newAddressOptionAch');            
                this.addressOnlyViewModelService.executeBindEvent(JUMP_ACH_ADDRESS_COMPONENT_LOADED);
                break;
            case JUMP_CC_TC_COMPONENT_LOADED:
                this.termsComponentCc = document.getElementById('jump-tc-cc');
                this.tcViewModelServiceCc = new TermsAndConditionViewModelService(this.termsComponentCc,this.termsAndConditionServiceCC,this.formValidationServiceAch,this.validationService);
                this.tcViewModelServiceCc.executeBindEvent(JUMP_CC_TC_COMPONENT_LOADED);
                break;
            case JUMP_ACH_TC_COMPONENT_LOADED:
                this.termsComponentAch = document.getElementById('jump-tc-ach');
                this.tcViewModelServiceAch = new TermsAndConditionViewModelService(this.termsComponentAch,this.termsAndConditionServiceAch,this.formValidationServiceAch,this.validationService);
                this.tcViewModelServiceAch.executeBindEvent(JUMP_ACH_TC_COMPONENT_LOADED);
                break;  
            case JUMP_CC_DEFAULT_PAYMENT_COMPONENT_LOADED:
                this.defaultPaymentCc = document.getElementById('jump-default-payment-cc');
                this.defaultPaymentViewModelServiceCc = new DefaultPaymentViewModelService(this.defaultPaymentCc,this.defaultPaymentService,this.formValidationServiceCc,this.validationService);
                this.defaultPaymentViewModelServiceCc.executeBindEvent(JUMP_CC_DEFAULT_PAYMENT_COMPONENT_LOADED);
                break;    
            case JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_LOADED:
                this.defaultPaymentAch = document.getElementById('jump-default-payment-ach');
                this.defaultPaymentViewModelServiceAch = new DefaultPaymentViewModelService(this.defaultPaymentAch,this.defaultPaymentService,this.formValidationServiceAch,this.validationService);
                this.defaultPaymentViewModelServiceAch.executeBindEvent(JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_LOADED);
                break; 
            case JUMP_CC_CARE_COMPONENT_LOADED:
                this.careCc = document.getElementById('jump-care-cc');
                this.careViewModelServiceCc = new CareViewModelService(this.careCc,this.careServiceCC,this.formValidationServiceCc,this.validationService);
                this.careViewModelServiceCc.executeBindEvent(JUMP_CC_CARE_COMPONENT_LOADED);
                break;    
            case JUMP_ACH_CARE_COMPONENT_LOADED:
                this.careAch = document.getElementById('jump-care-ach');
                this.careViewModelServiceAch = new CareViewModelService(this.careAch,this.careServiceACH,this.formValidationServiceAch,this.validationService);
                this.careViewModelServiceAch.executeBindEvent(JUMP_ACH_CARE_COMPONENT_LOADED);
                break; 
            case JUMP_CC_USERROLE_LIST_COMPONENT_LOADED:
                const configCc = this.validationService .setStoredPaymentValidationSelectionRequirement();
                const storedPaymentValidationSelectionCc = this.validationService .setStoredPaymentValidationSelection(configCc.displayAutoPayEnroll, configCc.displayStoredPaymentMethod, configCc.requireStoredPaymentSelection, configCc.selectStoredPaymentOnLoad);
                const userRoleListCc = this.global.appState.get('channelData')?.customerDetails?.userRoleList;

                if((userRoleListCc && this.channel.channelData.config?.enableMultipleUserSelection )|| storedPaymentValidationSelectionCc.displayStorePaymentComponent){  
                    this.userroleListComponentCc = document.getElementById('jump-userrole-list-cc');  
                    this.userroleListServiceCc = new UserroleListService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.errorHandling, 'CC');
                    this.userroleListViewModelServiceCc = new UserroleListViewModelService(this.userroleListComponentCc,this.userroleListServiceCc,this.formValidationServiceCc,this.validationService);                
                    this.appendUserroleComponent('[id="jump-userrole-list-cc"]');
                    this.userroleListViewModelServiceCc.executeBindEvent(JUMP_CC_USERROLE_LIST_COMPONENT_LOADED);
                }
                break;
            case JUMP_ACH_USERROLE_LIST_COMPONENT_LOADED:
                const configAch = this.validationService .setStoredPaymentValidationSelectionRequirement();
                const storedPaymentValidationSelectionAch = this.validationService .setStoredPaymentValidationSelection(configAch.displayAutoPayEnroll, configAch.displayStoredPaymentMethod, configAch.requireStoredPaymentSelection, configAch.selectStoredPaymentOnLoad);
                const userRoleListAch = this.global.appState.get('channelData')?.customerDetails?.userRoleList;

                if((userRoleListAch && this.channel.channelData.config?.enableMultipleUserSelection) || storedPaymentValidationSelectionAch.displayStorePaymentComponent){   
                    this.userroleListComponentAch = document.getElementById('jump-userrole-list-ach'); 
                    this.userroleListServiceAch = new UserroleListService(this.config,this.channel,this.currentPaymentType,this.errorMessageResponse,this.errorHandling, 'ACH');  
                    this.userroleListViewModelServiceAch = new UserroleListViewModelService(this.userroleListComponentAch,this.userroleListServiceAch,this.formValidationServiceAch,this.validationService);                
                    this.appendUserroleComponent('[id="jump-userrole-list-ach"]');            
                    this.userroleListViewModelServiceAch.executeBindEvent(JUMP_ACH_USERROLE_LIST_COMPONENT_LOADED);
                }
                break;
            }
        });
    }
    
    appendAddressOptionComponent(parentSelector:string,primaryAddressId:string,secondaryAddressId:string, newAddressId:string){
        const addressOptionArr:any = document.querySelector(parentSelector)?.querySelector('[name="jump-address-option-container"]');
        const addressList = this.channelData.customerDetails.addressList;
        if(addressOptionArr){            
            let addressOption:any;
            let componentId = '';
            if(addressList && addressList.length>0){
                for(let i=0;i<addressList.length;i++){
                    if(i>=2){
                        break;
                    }
                    componentId = '';
                    if(i===0){
                        componentId = primaryAddressId;
                    } else if(i===1){
                        componentId = secondaryAddressId;
                    }
                    addressOption = createAddressOptionDynamically(componentId,addressList[i]);
                    addressOptionArr.appendChild(addressOption);
                }
            }
            let addressFor = '';
            if(parentSelector.indexOf('-cc-')>=0){
                addressFor = CC;
            } else if(parentSelector.indexOf('-ach-')>=0){
                addressFor = ACH;
            }

            const newAddressOption = createAddressOptionForNewComponent(newAddressId , addressFor);
            addressOptionArr.appendChild(newAddressOption);
        }
    }
    
    appendUserroleComponent(parentSelector:string):void{
        const userroleListArr:any = document.querySelector(parentSelector)?.querySelector('[id="jump-userrole-list"]');
        const userRoleList = this.channelData.customerDetails?.userRoleList;
        if(userroleListArr){            
            let userroleOption:any;
            let componentId = '';
            let userroleFor = '';
            if(parentSelector.indexOf('-cc')>=0){
                userroleFor = CC;
            } else if(parentSelector.indexOf('-ach')>=0){
                userroleFor = ACH;
            }
            let defaultSelect = false;
            if(userRoleList && userRoleList.length>0){
                if(userRoleList.length === 1){
                    defaultSelect = true;
                }
                for (let i = 0; i < userRoleList.length; i++) {
                    componentId = 'userrole-' + userRoleList[i].walletId + '-' + userroleFor;
                    userroleOption = this.createUserroleDynamically(componentId, userRoleList[i], userroleFor, defaultSelect  );
                    userroleListArr.appendChild(userroleOption);
                }
            }
        }
    }

    createUserroleDynamically(componentId: string, userrole: UserRoleDetails, userroleFor: string, defaultSelect:boolean):HTMLElement {
        const userroleOption: any = document.createElement('jump-userrole-web-component');
        userroleOption.id = componentId;
        userroleOption.userroleLabel = userrole.role ? userrole.userId + '(' + userrole.role + ')' : userrole.userId;
        userroleOption.userroleFor = userroleFor;
        userroleOption.userroleSelected = (userrole.defaultUserRole || defaultSelect)? 'true' : 'false';
        return userroleOption;
    }
    
    run(){
        this.runApi().then(() => {
            const channelTemplateMapping = this.config.channelTemplateMapping;                
            this.mappedChannelTemplate = channelTemplateMapping.filter((ct:any)=>{return ct.channel.toLowerCase()=== this.channelData.channelDetails.channelName?.toLowerCase() && ct.template.toLowerCase() === this.config.cpcPageType.toString();});        
            this.currentPaymentType = this.mappedChannelTemplate[0]?.template.toLowerCase();
            this.currentAccountType = this.mappedChannelTemplate[0]?.accountType.toLowerCase();
            this.global.appState.set('currentAccountType', this.currentAccountType);
            this.load();
            this.runChild();
        });
    }

    render(url:string,templateSelector:string,componentIds:Array<string>){
        (async()=>{
            console.log('init service render');
            const data  = await this.fetchTemplate.get(url);
            const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');
            const template = Object.assign({});
            template.cc  = domContent.documentElement.querySelector('[id="' + templateSelector + '"]');
            //const templateContent1 = Object.assign({});
            try {
                template.ccContent = template.cc?.content?.cloneNode(true); 
                document.getElementById(JUMP_HOSTED_CONTAINER)?.appendChild(template.ccContent);
                this.renderChild(componentIds);            
            } catch (error:any) { 

                const err = 'Error while loading template or invalid template';
                const cpcMessage = this.errorHandling.getErrorInstance(EVN_CPC_ERROR, MessageType.backend, MessageType.error, err);
                this.errorHandling.showError(cpcMessage, err);  

            }      
            //this.load();
        })();  
    }    
    load(){  
        console.log('init service load');
        this.loadChild();
    }
    runChild(){
        //
    }
    renderChild(componentIds:Array<string>){
        //
    }
    loadChild(){
        //
    }
    async runApi(){
        await this.hc.getErrorMessage();
        await this.hc.getGlobalContent();
        this.hc.getPublicKey();
        return true;       
    }    
}
/*
TODO:
-remove from CardOnlyService(making circular depdendency): this.cardOnlyVmService = cardOnlyVmService;
-remove cardOnlyService reference from CardOnlyViewModelService.
-move the commonservice function into specific service e.g. CardOnlyService
-remove viewmodel from getPaymentConfiguration method, similar to getPublicKey

*/
