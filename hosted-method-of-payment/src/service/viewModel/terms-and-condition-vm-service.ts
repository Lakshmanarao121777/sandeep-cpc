import { IInputReference } from '../../model/view.model';
import { IViewModel } from '../../model/viewModel/view-model';
import { BaseViewModelService } from './base-vm.service';
import { TermsAndConditionWebComponent } from '../../index';
import { Validation } from '../../utils/validation';
import { FormValidationService } from '../form-validation-service';
import {  ACH, CC, TC_COMPONENT_CHECKED } from '../../constant/app.constant';
import { TermsAndConditionService } from '../terms-and-condition.service';
import { CPCContentType } from '../../model/view.model';
import { setPopupIcon } from '../../utils/card-type';
import { waitForElementToLoad } from '../../utils/elementLoader';
export class TermsAndConditionViewModelService extends BaseViewModelService{
    public view:TermsAndConditionWebComponent;
    public termsAndConditionService:TermsAndConditionService;     
    public inputReference: IInputReference = Object.assign({});
    public viewModel:IViewModel = Object.assign({});
    public formValidationService:FormValidationService;
    public tcFor:string;
    public isComponentLoaded = false;
    public isBindEventExecuted = false;
    constructor(view:TermsAndConditionWebComponent,termsAndConditionService:TermsAndConditionService,formValidationService:FormValidationService, validationService:Validation){
        super(validationService);
        this.formValidationService = new FormValidationService();
        this.view = view;
        this.tcFor = view?.tcFor;
        this.termsAndConditionService = termsAndConditionService;
        this.global.updateVmMap.set(TC_COMPONENT_CHECKED,false);
        console.log('Terms And Condition VM constructor');
    }

    handleComponentLoaded() : void{
        this.formValidationService.inputReference = this.inputReference;
        this.formValidationService.viewModel = this.viewModel;
        const userRoleList = this.global.appState.get('channelData')?.customerDetails?.userRoleList;
        if(userRoleList) {
            this.displayStorePaymentTitle();
        }
        this.removeStorePaymentErrorMessage();
        this.isStoredPaymentSelectionRequired();
        this.setElementReference();
        this.checkToRunBindEvent();
    }
 
    handleErrMessageLoaded(type:string) :void{
        this.executeBindEvent('handleErrMessageLoaded - terms-and-condition-vm-service.ts' + ' ' + type);
    }    
    handleReset() : void{
        this.reset();
    }
    bindEvents() : void{
        this.inputReference.storedPayment = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]');
        if(!this.inputReference.storedPayment) {
            this.inputReference.storedPayment = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]');
        }
    }
  
    displayTermsAndCondition(termsAndCondition:any,isTermsAndCondition:boolean): void {
        if(isTermsAndCondition) {
            termsAndCondition.checked = true;
            this.inputReference.termsAndCondition = Object.assign({'value':true});
        } else {
            termsAndCondition.checked = false;
            this.inputReference.termsAndCondition = Object.assign({'value':false});
        }
    }
    displayStorePaymentTitle():void {
        const storePaymentCc:any = document.querySelector('#jump-cc-web-component [name="jump-tc-label"]');
        const storePaymentAch:any = document.querySelector('#jump-ach-web-component [name="jump-tc-label"]');
        const globalStoredPaymentContent:any = this.getGlobalContentTitle(CPCContentType.terms_conditions_base_template, CPCContentType.terms_conditions_title);
        const userRoleList = this.global.appState.get('channelData')?.customerDetails?.userRoleList;

        if(userRoleList) {
            if(storePaymentCc && globalStoredPaymentContent) {
                storePaymentCc.innerHTML = globalStoredPaymentContent;
            }
            if(storePaymentAch && globalStoredPaymentContent) {
                storePaymentAch.innerHTML = globalStoredPaymentContent;
            }
        }
    }
    isStoredPaymentSelectionRequired():void {
        const storePaymentCc:any = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const storePaymentAch:any = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const global = this.global.appState.get('channelData')?.config;
        const channelName = this.global.appState.get('channelData')?.channelDetails.channelName.toLowerCase();
        const config = this.validationService.setStoredPaymentValidationSelectionRequirement();
        const storedPaymentValidationSelection = this.validationService.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
        if(storedPaymentValidationSelection.checkboxSelectedOnload) {
            if(storePaymentCc && (!config.displayAutoPayEnroll && !config.displayStoredPaymentMethod && !config.requireStoredPaymentSelection && config.selectStoredPaymentOnLoad)) {
                storePaymentCc.checked = true;
                storePaymentCc.disabled = false;
            } else if(storePaymentCc) {
                storePaymentCc.checked = true;
                storePaymentCc.disabled = true;
            }
            if(storePaymentAch && (!config.displayAutoPayEnroll && !config.displayStoredPaymentMethod && !config.requireStoredPaymentSelection && config.selectStoredPaymentOnLoad)) {
                storePaymentAch.checked = true;
                storePaymentAch.disabled = false;
            } else if(storePaymentAch) {
                storePaymentAch.checked = true;
                storePaymentAch.disabled = true;
            }
        }  
        const userRoleList = this.global.appState.get('channelData')?.customerDetails?.userRoleList;
        if(userRoleList && global?.enableMultipleUserSelection === true && global?.displayStoredPaymentOption && channelName === 'cafe') {
            const storePaymentIconCc:any = document.querySelector('#jump-cc-web-component [name="jump-stored-payment-icon"]');
            const storePaymentIconAch:any = document.querySelector('#jump-ach-web-component [name="jump-stored-payment-icon"]');
            if(storePaymentIconCc) {
                setPopupIcon(storePaymentIconCc,'stored-payment');
            }
            if(storePaymentIconAch) {
                setPopupIcon(storePaymentIconAch,'stored-payment');
            }
            this.setToolTip();
        }   
    }
    async setToolTip(): Promise<any> {
        const toolTipId = '[name="jump-tooltip"]';
        const toolTip:any = await waitForElementToLoad(toolTipId).then((toolTipEle:any) => {
            const globalStoredPaymentContent:any = this.getGlobalContentTitle(CPCContentType.stored_payment_base_tooltip_content, CPCContentType.stored_payment_tooltip_content);
            toolTipEle?.classList.remove('d-none');
            toolTipEle?.addEventListener('mouseenter', (e:any) => {
                e.preventDefault();
                const toolTipText:any = document.getElementById('jump-tooltip-text');
                if(toolTipText) {
                    toolTipText.innerHTML = globalStoredPaymentContent;
                }
            });
            toolTipEle?.addEventListener('mouseleave', function (e:any) {
                e.preventDefault();
            });
            return toolTipEle;
        }); 
    }  
    getGlobalContentTitle(key: string, subKey?: string):string {
        let getTitle = '';
        switch (key) {
        case CPCContentType.terms_conditions_base_template:
            getTitle = this.global.getContent(
                CPCContentType.terms_conditions_base_template,
                CPCContentType.terms_conditions_title
            );
            break;
        case CPCContentType.stored_payment_base_tooltip_content:
            getTitle = this.global.getContent(
                CPCContentType.terms_conditions_base_template,
                CPCContentType.stored_payment_tooltip_content
            );
            break;
        default:
            console.log('Terms and Condition Unknown key:', key);
        }
        return getTitle;
    }
    removeStorePaymentErrorMessage():void {
        const termsAndConditionCC =  document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const termsAndConditionAch =  document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        if(termsAndConditionCC){
            termsAndConditionCC?.addEventListener('click', (e:any) => {
                if(e.target?.checked ) {
                    this.removeStorePaymentErrorFeedback('storedPayment', CC);
                }    
            });
        }
        if(termsAndConditionAch){
            termsAndConditionAch?.addEventListener('click', (e:any) => {
                if(e.target?.checked) {
                    this.removeStorePaymentErrorFeedback('storedPayment', ACH);
                }    
            });
        }       
    }
    removeStorePaymentErrorFeedback = (reference: string, pageType: string) => {
        const parentId = this.inputReference[reference as keyof IInputReference]?.parentElement;
        const errFeedback = 'jump-tc-checkbox';
        if (parentId) {
            const selector = `[name='${errFeedback}-feedback']`;
            if (selector && parentId.querySelector(selector)) {
                parentId.querySelector(selector).remove();
            }
            if(pageType === CC) {
                const storedPaymentCCElement = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                storedPaymentCCElement.checked = true;
                storedPaymentCCElement?.classList?.remove('is-invalid');

            }
            if(pageType === ACH) {
                const storedPaymentAchElement = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
                storedPaymentAchElement.checked = true;
                storedPaymentAchElement?.classList?.remove('is-invalid');
            }
        }
    };
    reset(): void {
        const termsAndConditionCc = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const termsAndConditionAch = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        const config = this.validationService.setStoredPaymentValidationSelectionRequirement();
        const storedPaymentValidationSelection = this.validationService.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
        if(storedPaymentValidationSelection.checkboxSelectedOnload) {
            if(termsAndConditionCc) {
                termsAndConditionCc.checked = true;
                termsAndConditionCc.disabled = true;
                const userRoleList = document.querySelector('#jump-cc-web-component [id="jump-userrole-container"]');
                userRoleList?.classList.add('show');
                userRoleList?.classList.remove('d-none');
            }
            if(termsAndConditionAch) {
                termsAndConditionAch.checked = true;
                termsAndConditionAch.disabled = true;
                const userRoleList = document.querySelector('#jump-ach-web-component [id="jump-userrole-container"]');
                userRoleList?.classList.add('show');
                userRoleList?.classList.remove('d-none');
            }
        } else {
            if(termsAndConditionCc) {
                termsAndConditionCc.checked = false;
                termsAndConditionCc.disabled = false;
                const userRoleList = document.querySelector('#jump-cc-web-component [id="jump-userrole-container"]');
                userRoleList?.classList.remove('show');
                userRoleList?.classList.add('d-none');
            }
            if(termsAndConditionAch) {
                termsAndConditionAch.checked = false;
                termsAndConditionAch.disabled = false;
                const userRoleList = document.querySelector('#jump-ach-web-component [id="jump-userrole-container"]');
                userRoleList?.classList.remove('show');
                userRoleList?.classList.add('d-none');
            }
        }
    }
    
    submit(e:any): void{    
        let storedPaymentTermsCheckbox;
        const cardComponent =  document.getElementById('jump-cc-web-component');
        const bankComponent =  document.getElementById('jump-ach-web-component');
        if(cardComponent?.classList.contains('show')) {
            storedPaymentTermsCheckbox = document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        }
        if(bankComponent?.classList.contains('show')) {
            storedPaymentTermsCheckbox = document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]') as HTMLInputElement;
        }
        if(storedPaymentTermsCheckbox) {
            this.global.updateVmMap.set(TC_COMPONENT_CHECKED,storedPaymentTermsCheckbox.checked);
        }
    }
}
