import { JUMP_ACH_TYPE_COMPONENT_LOADED } from '../constant/app.constant';
import {IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { CommonWebComponent } from './common-web.component';

export class AccountTypeWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    accTypeActionDispatcher:ActionObserverService;
    _accountTypeFor = '';
    commonWebComponent = new CommonWebComponent();
    global:Globals;

    static get observedAttributes(): string[] {
        return ['account-type-for'];
    }
    get accountTypeFor(){
        return this._accountTypeFor;
    } 
    set accountTypeFor(value) {
        if(value) {
            this.setAttribute('account-type-for', value);
            this._accountTypeFor = value;
        }
    }
    constructor(){
        super();        
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        this.accTypeActionDispatcher = Globals.getInstance().actionObserverService;
        this.commonWebComponent.init('account-type-base-template',this , this.accTypeActionDispatcher , JUMP_ACH_TYPE_COMPONENT_LOADED);                
    }
    attributeChangedCallback(attrName: string, oldValue: string, newValue: string): void {
        this.commonWebComponent.attributeChangedCallback(attrName , oldValue , newValue , this);
    }

    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="AccountTypeBaseTemplate"]');

        if(template.cc){                
            template.ccContent =template.cc?.content?.cloneNode(true);      
            this._content.appendChild(template.ccContent);
            this.appendChild(this._content);
        }
    }
    validate(): boolean {
        return true;
    }
    submit(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {
        //this.accountTypeOnlyService.paymentClick(paymentSuccess, vm, cpcPageType);
    }  
} 
customElements.define('jump-account-type-web-component', AccountTypeWebComponent);