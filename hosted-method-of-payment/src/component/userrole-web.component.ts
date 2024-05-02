import { CommonWebComponent } from '..';
import { JUMP_USERROLE_COMPONENT_LOADED } from '../constant/app.constant';
import {IViewModelEncrypted } from '../model/view.model';
import { ActionObserverService } from '../service/action-observer-service';
import { Globals } from '../utils/globals';

export class UserroleWebComponent extends HTMLElement {  
    _content: DocumentFragment;
    _userroleFor = '';
    _userroleLabel = '';    
    _userroleSelected = '';
    userroleActionDispatcher:ActionObserverService;
    commonWebComponent = new CommonWebComponent();
    global: Globals;

    static get observedAttributes(): string[] {
        return ['userrole-for','userrole-label'];
    }
    get userroleFor(){
        return this._userroleFor;
    } 
    set userroleFor(value) {
        if(value) {
            this.setAttribute('userrole-for', value);
            this._userroleFor = value;
        }
    }
    get userroleLabel(){
        return this._userroleLabel;
    } 
    set userroleLabel(value) {
        if(value) {
            this.setAttribute('userrole-label', value);
            this._userroleLabel = value;
        }
    }
    
    get userroleSelected(){
        return this._userroleSelected;
    } 
    set userroleSelected(value) {
        if(value) {
            if(value === 'true'){
                this.setAttribute('userrole-selected', value);
            }else{
                this.removeAttribute('userrole-selected');
            }
            this.setAttribute('userrole-selected', value);
            this._userroleSelected = value;
        }
    }
    constructor(){
        super();        
        console.log('userrole option constructor called!!');
        this._content = new DocumentFragment();
        this.global = Globals.getInstance();
        this.userroleActionDispatcher = Globals.getInstance().actionObserverService;
        this.commonWebComponent.init('userrole-base-template', this, this.userroleActionDispatcher, JUMP_USERROLE_COMPONENT_LOADED);
    }
    render(data: any): void {
        const domContent = new DOMParser().parseFromString(data.toString(), 'text/html');      
        const template = Object.assign({});
        template.cc = domContent.documentElement.querySelector('[id="UserroleBaseTemplate"]');

        if(template.cc){                
            template.ccContent =template.cc?.content?.cloneNode(true);            
            this._content.appendChild(template.ccContent);
            this.appendChild(this._content);            
            this.bind();
        }
    }
    bind(): void { 
        const ele = document.getElementById(this.id);
        const labelEle = ele?.querySelector('[name="jump-userrole-label"]');
        const inputEle = ele?.querySelector('[name="jump-userrole-id"]');
        if(labelEle){
            labelEle.innerHTML = this.userroleLabel;            
        }
        if(inputEle){
            if( this.userroleSelected === 'true'){
                inputEle.setAttribute('checked', 'checked');
            }else{
                inputEle.removeAttribute('checked');
            }
        }
    }
    validate(): boolean {
        return true;
    }
    submit(paymentSuccess: boolean, vm:IViewModelEncrypted, cpcPageType:string): void {
        //
    }  
} 
customElements.define('jump-userrole-web-component', UserroleWebComponent);