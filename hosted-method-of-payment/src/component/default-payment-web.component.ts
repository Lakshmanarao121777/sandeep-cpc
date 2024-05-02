import { FetchData } from '../api/fetch-data';
import { JUMP_CC_DEFAULT_PAYMENT_COMPONENT_LOADED, JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_LOADED, CC, ACH } from '../constant/app.constant';
import {IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';

export class DefaultPaymentWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    defaultPaymentActionDispatcher:ActionObserverService;
    _defaultPaymentFor = '';
    global:Globals;

    static get observedAttributes(): string[] {
        return ['default-payment-for'];
    }
    get defaultPaymentFor(){
        return this._defaultPaymentFor;
    } 
    set defaultPaymentFor(value) {
        if(value) {
            this.setAttribute('default-payment-for', value);
            this._defaultPaymentFor = value;
        }
    }
    constructor(){
        super();        
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        this.defaultPaymentActionDispatcher = Globals.getInstance().actionObserverService;
        this.init();

    }
    attributeChangedCallback(attrName:string, oldValue:string, newValue:string) :void {    
        if(newValue !== oldValue) {
            switch (attrName) {
            case 'default-payment-for':
                this._defaultPaymentFor = newValue;
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
        const rootUrl = this.global.appState.get('config').envConfig.cpcEnv.split('/');
        const url:string = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/default-payment-base-template.html';
        this.fetchTemplate(url);
    }
  
    async fetchTemplate(url: string) {
        const fetchData = new FetchData();     
        const data  = await fetchData.get(url);
        let defaultPaymentComponentLoaded = '';
        if(data) {
            this.render(data);
            if(this._defaultPaymentFor.toLowerCase() === CC) {
                defaultPaymentComponentLoaded = JUMP_CC_DEFAULT_PAYMENT_COMPONENT_LOADED;
            } else if(this._defaultPaymentFor === 'ACH') {
                defaultPaymentComponentLoaded = JUMP_ACH_DEFAULT_PAYMENT_COMPONENT_LOADED;
            }
            this.defaultPaymentActionDispatcher.fire(this,{detail: {action : defaultPaymentComponentLoaded}}); 
        }
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="DefaultPaymentBaseTemplate"]');

        const defaultBaseTemplateCC =  document.querySelector('#jump-cc-web-component [name="jump-default-payment"]');
        const defaultBaseTemplateACH =  document.querySelector('#jump-ach-web-component [name="jump-default-payment"]');
        if(this._defaultPaymentFor.toLowerCase() === CC){
            if(!defaultBaseTemplateCC){
                if(template.cc){                
                    template.ccContent =template.cc?.content?.cloneNode(true);      
                    this._content.appendChild(template.ccContent);
                    this.appendChild(this._content);
                }
            }
        }else if(this._defaultPaymentFor.toLowerCase() === ACH){
            if(!defaultBaseTemplateACH){
                if(template.cc){                
                    template.ccContent =template.cc?.content?.cloneNode(true);      
                    this._content.appendChild(template.ccContent);
                    this.appendChild(this._content);
                }
            }
        }
    }
} 
customElements.define('jump-default-payment-web-component', DefaultPaymentWebComponent);