import { FetchData } from '../api/fetch-data';
import {IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';

export class AddressOptionWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    _addressFor = '';
    _addressLabel = '';    
    _fullAddress = '';
    addressOptionActionDispatcher:ActionObserverService;

    static get observedAttributes(): string[] {
        return ['address-for','address-label','full-address'];
    }
    get addressFor(){
        return this._addressFor;
    } 
    set addressFor(value) {
        if(value) {
            this.setAttribute('address-for', value);
            this._addressFor = value;
        }
    }
    get addressLabel(){
        return this._addressLabel;
    } 
    set addressLabel(value) {
        if(value) {
            this.setAttribute('address-label', value);
            this._addressLabel = value;
        }
    }
    get fullAddress(){
        return this._fullAddress;
    } 
    set fullAddress(value) {
        if(value) {
            this.setAttribute('full-address', value);
            this._fullAddress = value;
        }
    }    
    constructor(){
        super();        
        console.log('address option constructor called!!');
        this._content = new DocumentFragment();
        this.addressOptionActionDispatcher = Globals.getInstance().actionObserverService;
        this.init();        
    }    
    init(): void {     
        if(!this._content) {
            return;
        }        
        const config = Globals.getInstance().appState.get('config');
        const rootUrl = config.envConfig.cpcEnv.split('/');
        const addressList = Globals.getInstance().appState.get('channelData').customerDetails.addressList;
        let addressOptionBaseTemplate = 'template/base/address-option-base-template.html';
        if(!addressList) {
            addressOptionBaseTemplate = 'template/base/address-option-checkbox-base-template.html';
        }
        const url:string = config.envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + addressOptionBaseTemplate;
        this.fetchTemplate(url);        
    }
  
    async fetchTemplate(url: string) {
        const fetchData = new FetchData();     
        const data  = await fetchData.get(url);
        if(data) {
            this.render(data);
            console.log('address-for ', this.addressFor.toLowerCase());
            this.addressOptionActionDispatcher.fire(this,{detail: {action : 'jump-address-option-component-loaded', componentId:this.id }});
        }
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="AddressOptionBaseTemplate"]');

        if(template.cc){                
            template.ccContent =template.cc?.content?.cloneNode(true);            
            this._content.appendChild(template.ccContent);
            this.appendChild(this._content);            
            this.bind();
        }
    }
    bind(): void {
        const ele = document.getElementById(this.id);
        const labelEle = ele?.querySelector('[name="jump-address-label"]');
        const newLabelEle = ele?.querySelector('[name="jump-address-accessibility-label"]');
        const addressEle = ele?.querySelector('[name="jump-existing-address-info"]');
        const inputEle = ele?.querySelector('[name="jump-address-option"]');
        if(labelEle){
            labelEle.innerHTML = this.addressLabel;            
        }
        if(addressEle){
            addressEle.innerHTML = this.fullAddress;
            addressEle.setAttribute('id',`${this.id}-jump-existing-address-info-label`);
        }
        if(inputEle) {
            inputEle.setAttribute('aria-labelledby',`${this.id}-jump-existing-address-info-label`);
            inputEle.setAttribute('aria-describedby',`${this.id}-jump-existing-address-info-label`);
        }
        if(labelEle?.innerHTML === 'New address' || newLabelEle?.innerHTML?.includes('Use a different address')) {
            if(addressEle) {
                addressEle?.removeAttribute('id');
            }
            labelEle?.setAttribute('id',`${this.id}-jump-existing-address-info-label`);
            newLabelEle?.setAttribute('id',`${this.id}-jump-existing-address-info-label`);
        }
        //this.addressOnlyService.bindOptionTemplateToView(this.id);
    }
    validate(): boolean {
        return true;
        //return this.addressOnlyService.applyValidation();
    }
    submit(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {
        //
    }  
} 
customElements.define('jump-address-option-component', AddressOptionWebComponent);