import { FetchData } from '../api/fetch-data';
import { IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';
import { CommonWebComponent } from './common-web.component';

export class AddressWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    _addressFor = '';
    addressActionDispatcher:ActionObserverService;
    commonWebComponent = new CommonWebComponent();
    global:Globals;

    static get observedAttributes(): string[] {
        return ['address-for'];
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
    constructor(){
        super();
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        this.addressActionDispatcher = Globals.getInstance().actionObserverService;
        this.init();
    }

    attributeChangedCallback(attrName:string, oldValue:string, newValue:string) :void { 
        this.commonWebComponent.attributeChangedCallback(attrName , oldValue , newValue , this);   
        // if(newValue !== oldValue) {
        //     switch (attrName) {
        //     case 'address-for':
        //         this._addressFor = newValue;                
        //         break;           
        //     default:
        //         break;
        //     }            
        // }
    }

  
  
    init(): void {     
        if(!this._content) {
            return;
        }
        const rootUrl = this.global.appState.get('config').envConfig.cpcEnv.split('/');
        const url:string = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/address-base-template.html';

        this.fetchTemplate(url);
    }
  
    async fetchTemplate(url: string) {
        const fetchData = new FetchData();     
        const data  = await fetchData.get(url);
        if(data) {
            this.render(data);
            console.log('address-for ', this.addressFor.toLowerCase());
            this.addressActionDispatcher.fire(this,{detail: {action : 'jump-' + this.addressFor.toLowerCase() + '-address-component-loaded' }});
        }
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="AddressBaseTemplate"]');

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
        console.log('in submit');
    }  
}
customElements.define('jump-address-web-component', AddressWebComponent);