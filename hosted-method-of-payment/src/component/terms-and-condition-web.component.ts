import { FetchData } from '../api/fetch-data';
import { ActionObserverService } from '../service/action-observer-service';
import { JUMP_CC_TC_COMPONENT_LOADED, JUMP_ACH_TC_COMPONENT_LOADED, CPC_BANK_TERMS_AND_CONDITION_SELECTED, CPC_CARD_TERMS_AND_CONDITION_SELECTED, CPC_GLOBAL_TEMPLATE_URL, WALLET_MGMT_NO_AUTOPAY, CC, ACH } from '../constant/app.constant';

import { Globals } from '../utils/globals';
import { DataLayerService } from '../service/data-layer.service';
import { Validation } from '../utils/validation';
import { CommonWebComponent } from './common-web.component';
import { CPCContentType } from '../model/view.model';

export class TermsAndConditionWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    _tcFor = '';
    tcActionDispatcher:ActionObserverService;
    commonWebComponent = new CommonWebComponent();
    global:Globals;
    private dataLayerService:DataLayerService = Object.assign({});
    public validations = new Validation();
    _modalContent = Object.assign({});

    static get observedAttributes(): string[] {
        return ['tc-for'];
    }
    get tcFor(): string {
        return this._tcFor;
    }
    set tcFor(value: string) {
        if (value) {
            this.setAttribute('tc-for', value);
            this._tcFor = value;
        }
    }
    constructor(){
        super();
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        console.log('Terms & Condition WebComp Constructor');
        this.tcActionDispatcher = Globals.getInstance().actionObserverService;
        this.dataLayerService = new DataLayerService();
        this.init();
    }

    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        this.commonWebComponent.attributeChangedCallback(attrName , oldValue , newValue , this);
    }
    init(): void {     
        if(!this._content) {
            return;
        }  
        const rootUrl = this.global.appState.get('config').envConfig.cpcEnv.split('/');
        const displayTcStyle = this.global.appState.get('channelData')?.config?.termsAndConditionsDisplayOption;
        let url:string = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/terms-and-condition-base-template.html';

        if(displayTcStyle && displayTcStyle === 'modal') {
            url = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/terms-and-condition-modal-base-template.html';
        } 
        const displayTermsCondition:boolean = this.global.appState.get('channelData')?.config?.displayStoredPaymentOption;

        const cpcPageType:any = this.global.appState.get('config').cpcPageType.toLowerCase();
        const isStoredPaymentRequired:any = cpcPageType === WALLET_MGMT_NO_AUTOPAY.toLowerCase();
        
        const isSetStoredPayment = this.validations.isSetStoredPayment();
        if(isSetStoredPayment) {
            this.fetchTemplate(url);
        } else if(!isSetStoredPayment && displayTermsCondition) {
            this.fetchTemplate(url);
        } else if(isStoredPaymentRequired) {
            this.fetchTemplate(url);
        }
        this.fetchModalTemplate();
    }
  
    async fetchTemplate(url: string): Promise<void> {
        const fetchData = new FetchData();     
        const data  = await fetchData.get(url);
        let tcComponentLoaded = '';
        if(data) {
            this.render(data);
            if(this.tcFor.toLowerCase() === CC) {
                tcComponentLoaded = JUMP_CC_TC_COMPONENT_LOADED;
            } else if(this.tcFor.toLowerCase() === ACH) {
                tcComponentLoaded = JUMP_ACH_TC_COMPONENT_LOADED;
            }
            this.displayAchOrCC(this.tcFor);
            this.tcActionDispatcher.fire(this,{detail: {action : tcComponentLoaded}});
        }
    }
    async fetchModalTemplate(){
        const globals = Globals.getInstance();
        const config = globals.appState.get('config');
        const templates = config.envConfig.globalUrl;
        const autoPaytermsConditionsUrl = `${templates}${CPC_GLOBAL_TEMPLATE_URL}terms-conditions-modal-template.html`;
        const fetchData = new FetchData();     
        const data  = await fetchData.get(autoPaytermsConditionsUrl);
        if(data){
            this._modalContent =data;
        }
    }

    displayAchOrCC(tcFor:string):void {
        const cache = Object.assign({});
        cache.termsAndConditionCC =  document.querySelector('#jump-cc-web-component [name="jump-tc-checkbox"]');
        cache.termsAndConditionAch =  document.querySelector('#jump-ach-web-component [name="jump-tc-checkbox"]');
        if( cache.termsAndConditionCC ){
            cache.pageTypeCC = 'CardOnly';
            cache.termsAndConditionCC?.addEventListener('click', (e:any) => {
                if(e.target?.checked ) {
                    cache.termsAndConditionCC.checked = true;
                    this.dispatchEventInfo(cache.pageTypeCC, true);
                    this.displayUserList(e.target?.checked);
                } else if(!e.target?.checked) {
                    cache.termsAndConditionCc = Object.assign({checked: false});
                    this.dispatchEventInfo(cache.pageTypeCC, false);
                    this.displayUserList(e.target?.checked);
                }     
            });
        }
        if( cache.termsAndConditionAch){
            cache.pageTypeAch = 'AchOnly';
            cache.termsAndConditionAch?.addEventListener('click', (e:any) => {
                if(e.target?.checked) {
                    cache.termsAndConditionAch.checked = true;
                    this.dispatchEventInfo(cache.pageTypeAch, true);
                    this.displayUserList(e.target?.checked);
                } else if(!e.target?.checked) {
                    cache.termsAndConditionAch.checked = false;
                    this.dispatchEventInfo(cache.pageTypeAch, false);
                    this.displayUserList(e.target?.checked);
                }     
            });
        }
        const displayTcStyle = this.global.appState.get('channelData')?.config?.termsAndConditionsDisplayOption;
        if(displayTcStyle && displayTcStyle === 'modal') {
            if(tcFor.toLowerCase() === CC) {
                cache.termsAndConditionPopup =  document.querySelector('#jump-cc-web-component [name="jump-terms-condition-info"]');
            } else if(this.tcFor.toLowerCase() === ACH) {
                cache.termsAndConditionPopup =  document.querySelector('#jump-ach-web-component [name="jump-terms-condition-info"]');
            } 
            cache.termsAndConditionPopup?.addEventListener('click', () => {
                this.launchModalPopup();
            });
        }

        return cache;
    }
    displayUserList(isStoredPaymentChecked:any) {
        const userroleListContainerCc = document.querySelector('#jump-card-only-container [id="jump-userrole-container"]');
        const userroleListContainerAch = document.querySelector('#jump-ach-only-container [id="jump-userrole-container"]');
        const config = this.validations.setStoredPaymentValidationSelectionRequirement();
        const storedPaymentValidationSelection = this.validations.setStoredPaymentValidationSelection(config.displayAutoPayEnroll, config.displayStoredPaymentMethod, config.requireStoredPaymentSelection, config.selectStoredPaymentOnLoad);
        if (storedPaymentValidationSelection.selectStoredPaymentOnLoad || isStoredPaymentChecked) {
            userroleListContainerCc?.classList.remove('d-none');
            userroleListContainerCc?.classList.add('show');
            userroleListContainerAch?.classList.remove('d-none');
            userroleListContainerAch?.classList.add('show');
        } else {
            userroleListContainerCc?.classList.add('d-none');
            userroleListContainerCc?.classList.remove('show');
            userroleListContainerAch?.classList.add('d-none');
            userroleListContainerAch?.classList.remove('show');
        }
    }
    dispatchEventInfo(pageType:string, isChecked:boolean):void {
        if(pageType === 'CardOnly') {
            if(isChecked) {
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_TERMS_AND_CONDITION_SELECTED, true);
            } else {
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_TERMS_AND_CONDITION_SELECTED, false);
            }
        }
        if(pageType === 'AchOnly') {
            if(isChecked) {
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_TERMS_AND_CONDITION_SELECTED, true);
            } else {
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_TERMS_AND_CONDITION_SELECTED, false);
            }
        }
    }

    launchModalPopup(): void{
        const modalPopupTitle = document.getElementById('jumpModalTitle');
        const modalPopupBody = document.getElementById('jumpModalBody');      
        if(modalPopupTitle){
            const title = this.getCPCContent(CPCContentType.terms_conditions, CPCContentType.terms_conditions_modal_title);
            modalPopupTitle.innerHTML =  title;
        }
        if(modalPopupBody){
            modalPopupBody.innerHTML = this._modalContent;
        }
    }
    getCPCContent(key:string, subKey?:string): string {        
        let getTitle = '';
        switch(key){          
        case CPCContentType.terms_conditions  :            
            getTitle = this.global.getContent(CPCContentType.terms_conditions, CPCContentType.terms_conditions_modal_title);
            break;
        }
        return getTitle;
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="TCBaseTemplate"]');

        if(template.cc){                
            template.ccContent =template.cc?.content?.cloneNode(true);                  
            this._content.appendChild(template.ccContent);
            this.appendChild(this._content);
        }
    }
    validate(): boolean {
        return true;
    }
    
}
customElements.define('jump-terms-and-condition-web-component', TermsAndConditionWebComponent);
