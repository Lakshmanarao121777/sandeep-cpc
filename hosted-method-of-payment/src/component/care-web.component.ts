import { FetchData } from '../api/fetch-data';
import { CC, JUMP_ACH_CARE_COMPONENT_LOADED, JUMP_CC_CARE_COMPONENT_LOADED } from '../constant/app.constant';
import {IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';

export class CareWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    careActionDispatcher:ActionObserverService;
    _careFor = '';
    global:Globals;

    static get observedAttributes(): string[] {
        return ['care-for'];
    }
    get careFor(){
        return this._careFor;
    } 
    set careFor(value) {
        if(value) {
            this.setAttribute('care-for', value);
            this._careFor = value;
        }
    }
    constructor(){
        super();        
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        this.careActionDispatcher = Globals.getInstance().actionObserverService;
        this.init();

    }
    attributeChangedCallback(attrName:string, oldValue:string, newValue:string) :void {    
        if(newValue !== oldValue) {
            switch (attrName) {
            case 'care-for':
                this._careFor = newValue;
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
        const url:string = this.global.appState.get('config').envConfig.cpcEnv.replace(rootUrl[rootUrl.length - 1], '') + 'template/base/care-base-template.html';
        this.fetchTemplate(url);
    }
  
    async fetchTemplate(url: string) {
        const fetchData = new FetchData();     
        const data  = await fetchData.get(url);
        if(data) {
            this.render(data);
            if(this._careFor.toLowerCase() === CC){
                this.careActionDispatcher.fire(this,{detail: {action : JUMP_CC_CARE_COMPONENT_LOADED}});            
            }else{
                this.careActionDispatcher.fire(this,{detail: {action : JUMP_ACH_CARE_COMPONENT_LOADED}});            
            }
        }
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="CareBaseTemplate"]');

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
customElements.define('jump-care-web-component', CareWebComponent);