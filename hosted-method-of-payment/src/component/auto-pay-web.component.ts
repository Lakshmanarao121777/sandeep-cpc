import { FetchData } from '../api/fetch-data';
import { CPCContentType, IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { JUMP_CC_AUTO_PAY_COMPONENT_LOADED, JUMP_ACH_AUTO_PAY_COMPONENT_LOADED, CPC_CARD_AUTO_PAY_SELECTED, CPC_BANK_AUTO_PAY_SELECTED, CARD_ONLY, ACH_ONLY, TandCsViewTypeModal, CPC_GLOBAL_TEMPLATE_URL, CC, ACH } from '../constant/app.constant';
import { DataLayerService } from '../service/data-layer.service';
import { Globals } from '../utils/globals';
import { Validation } from '../utils/validation';


export class AutoPayWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    _autoPayFor = '';
    _autoPayLabel = '';
    autoPayActionDispatcher:ActionObserverService;
    global:Globals;
    public validations = new Validation();
    private dataLayerService:DataLayerService = Object.assign({});
    _modalContent:any;
    static get observedAttributes(): string[] {
        return ['auto-pay-for'];
    }
    get autoPayFor() {
        return this._autoPayFor;
    }
    set autoPayFor(value) {
        if (value) {
            this.setAttribute('auto-pay-for', value);
            this._autoPayFor = value;
        }
    }
    constructor(){
        super();
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        console.log('Auto Pay WebComp Constructor');
        this.autoPayActionDispatcher = Globals.getInstance().actionObserverService;
        this.dataLayerService = new DataLayerService();
        this.init();
    }

    attributeChangedCallback(
        attrName: string,
        oldValue: string,
        newValue: string
    ): void {
        if (newValue !== oldValue) {
            switch (attrName) {           
            case 'auto-pay-for':
                this._autoPayFor = newValue;
                break;
            default:
                break;
            }
        }
    }
    init(): void {     
        if(!this._content) {
            return;
        }  
        const displayAutoPay = this.global.appState.get('channelData')?.config?.displayAutoPayEnroll;
        const channelName = this.global.appState.get('channelData')?.channelDetails.channelName;
        const globals = Globals.getInstance();
        const config = globals.appState.get('config');
        const templates = config.envConfig.globalUrl+ CPC_GLOBAL_TEMPLATE_URL;
        const isBusinessChannelNameAllowed = this.validations.isBusinessChannelNameAllowed(channelName);
        let url = ''; 
        if(displayAutoPay) {
            if(isBusinessChannelNameAllowed) {
                url = `${templates}base/auto-pay-option-base-template.html`;
            } else {
                const displayTcStyle = this.global.appState.get('channelData')?.config?.termsAndConditionsDisplayOption;
                if(displayTcStyle && displayTcStyle === TandCsViewTypeModal) {
                    url = `${templates}base/auto-pay-modal-base-template.html`;
                }else{
                    url = `${templates}base/auto-pay-base-template.html`; 
                }
            }
            this.fetchTemplate(url);
            this.fetchModalTemplate();
        } 
    }
    async fetchModalTemplate(){
        const globals = Globals.getInstance();
        const config = globals.appState.get('config');
        const templates = config.envConfig.globalUrl+CPC_GLOBAL_TEMPLATE_URL;
        const  autoPaytermsConditionsUrl = `${templates}auto-pay-terms-conditions-modal-template.html`;
        const fetchData = new FetchData();     
        const data  = await fetchData.get(autoPaytermsConditionsUrl);
        if(data){
            this._modalContent =data;
        }
    }
  
    async fetchTemplate(url: string) {
        const fetchData = new FetchData();     
        const data  = await fetchData.get(url);
        let autoPayComponentLoaded = '';
        if(data) {
            this.render(data);
            if(this.autoPayFor.toLowerCase() === CC) {
                autoPayComponentLoaded = JUMP_CC_AUTO_PAY_COMPONENT_LOADED;
            } else if(this.autoPayFor.toLowerCase() === ACH) {
                autoPayComponentLoaded = JUMP_ACH_AUTO_PAY_COMPONENT_LOADED;
            }
            this.displayAchOrCC(this.autoPayFor);
            this.autoPayActionDispatcher.fire(this,{detail: {action : autoPayComponentLoaded}});
        }
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="AutoPayBaseTemplate"]');

        if(template.cc){                
            template.ccContent =template.cc?.content?.cloneNode(true);                  
            this._content.appendChild(template.ccContent);
            this.appendChild(this._content);
        }
    }
    displayAchOrCC(autoPayFor:string) {
        const cache = Object.assign({});
        const channelName = this.global.appState.get('channelData')?.channelDetails.channelName;
        const isBusinessChannelNameAllowed = this.validations.isBusinessChannelNameAllowed(channelName);
        if(autoPayFor.toLowerCase() === CC) {
            cache.termsAndCondition =  document.querySelectorAll('#jump-cc-web-component [name="jump-terms-of-conditions"]')[0];
            cache.autoPay =  document.querySelector('#jump-cc-web-component [name="jump-auto-pay-checkbox"]');
            cache.pageType = CARD_ONLY;
        } else if(autoPayFor.toLowerCase() === ACH) {
            cache.termsAndCondition =  document.querySelectorAll('#jump-ach-web-component [name="jump-terms-of-conditions"]')[0];
            cache.autoPay =  document.querySelector('#jump-ach-web-component [name="jump-auto-pay-checkbox"]');
            cache.pageType = ACH_ONLY;
        }        
        cache.autoPay?.addEventListener('click', (e:any) => {
            if(e.target?.checked ) {
                this.displayTermsAndCondition(cache,true);
                this.dispatchEventInfo(cache.pageType, true);
            } else if(!e.target?.checked) {
                if(isBusinessChannelNameAllowed) {
                    this.displayTermsAndCondition(cache,true);
                    this.dispatchEventInfo(cache.pageType, false);
                } else {
                    this.displayTermsAndCondition(cache,false);
                    this.dispatchEventInfo(cache.pageType, false);
                }
                
            }     
        });
        const displayAutoPayStyle = this.global.appState.get('channelData')?.config?.termsAndConditionsDisplayOption;
        if(displayAutoPayStyle && displayAutoPayStyle === TandCsViewTypeModal) {
            if(autoPayFor.toLowerCase() === CC) {
                cache.termsAndConditionPopup =  document.querySelector('#jump-cc-web-component [name="jump-auto-pay-info"]');
            } else if(this.autoPayFor.toLowerCase() === ACH) {
                cache.termsAndConditionPopup =  document.querySelector('#jump-ach-web-component [name="jump-auto-pay-info"]');
            } 
            cache.termsAndConditionPopup?.addEventListener('click', () => {
                this.launchModalPopup();
            });
        }
        return cache;
    }
    launchModalPopup(): void{
        const globals = Globals.getInstance();
        const modalPopupTitle = document.getElementById('jumpModalTitle');
        const modalPopupBody = document.getElementById('jumpModalBody');
        if(modalPopupTitle){
            const title = this.getCPCContent(CPCContentType.auto_pay,CPCContentType.auto_pay_modal_title);
            modalPopupTitle.innerHTML = title; 
        }
        if(modalPopupBody){
            modalPopupBody.innerHTML = this._modalContent;
        } 
    }
    getCPCContent(key:string, subKey?:string): string {        
        let getTitle = '';
        switch(key){          
        case CPCContentType.auto_pay  :            
            getTitle = this.global.getContent(CPCContentType.auto_pay, CPCContentType.auto_pay_modal_title);
            break;
        }
        return getTitle;
    }
    dispatchEventInfo(pageType:string, isChecked:boolean):void {
        if(pageType === CARD_ONLY) {
            if(isChecked) {
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_AUTO_PAY_SELECTED, true);
            } else {
                this.dataLayerService.dispatchInfoEvent(CPC_CARD_AUTO_PAY_SELECTED, false);
            }
        }
        if(pageType === ACH_ONLY) {
            if(isChecked) {
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_AUTO_PAY_SELECTED, true);
            } else {
                this.dataLayerService.dispatchInfoEvent(CPC_BANK_AUTO_PAY_SELECTED, false);
            }
        }
    }
    displayTermsAndCondition(auto:any,isAutoPay:boolean) {
        if(isAutoPay) {
            auto.termsAndCondition?.classList.remove('d-none');
            auto.termsAndCondition?.classList.add('show');
            auto.autoPay = Object.assign({'checked':true});
        } else {
            auto.termsAndCondition?.classList.add('d-none');
            auto.termsAndCondition?.classList.remove('show');
            auto.autoPay = Object.assign({'checked':false});
        }
    }
    validate(): boolean {
        return true;
    }
    submit(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {
        //this.autoPayService.paymentClick(paymentSuccess, vm, cpcPageType);
    }  
}
customElements.define('jump-auto-pay-web-component', AutoPayWebComponent);
